import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCardPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import store from "../../Store";
import { fetchAddress } from "../user/userSlice";
// import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();
  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCardPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-stone-800">
        Ready to order? Lets go!
      </h2>
      <Form method="POST">
        <div className="mt-5">
          <label className="mb-3 block text-base font-medium text-[#07074D]">
            First Name
          </label>
          <input
            type="text"
            name="customer"
            required
            className="input"
            defaultValue={username}
          />
        </div>
        <div className="mt-5">
          <label className="mb-3 block text-base font-medium text-[#07074D]">
            Phone Number
          </label>
          <div>
            <input type="tel" name="phone" required className="input" />
          </div>
          {formErrors?.phone && (
            <p className="mt-2 text-sm text-red-500">{formErrors.phone}</p>
          )}
        </div>
        <div className="relative mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="mb-3 block text-base font-medium text-[#07074D]">
            Address
          </label>
          <div className="flex-1">
            <input
              type="text"
              name="address"
              required
              className="input"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === "error" && (
              <p className="mt-4 rounded-md bg-red-100 p-2 text-sm text-red-500">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute -top-1.5 right-0 z-50">
              <Button
                type="small"
                disabled={isLoadingAddress}
                onClick={() => dispatch(fetchAddress())}
              >
                get position
              </Button>
            </span>
          )}
        </div>
        <div className="mt-5 flex items-center">
          <input
            className="h-4 w-4 accent-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />

          <label htmlFor="priority" className="ml-3 font-bold text-stone-800">
            want to yo give your order priority
          </label>
        </div>
        <div className="mt-5">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position "
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button type="primary">
            {isSubmitting || isLoadingAddress
              ? "Placing order...."
              : `Order now form ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  // Error Message
  // const errors = {};
  // if (isValidPhone(order.phone))
  //   errors.phone = "Please give us your phone number";
  // if (Object.keys(errors).length > 0) return errors;
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  // Do Not overuse
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
