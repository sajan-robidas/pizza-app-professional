import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
// import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();

  const cart = fakeCart;
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
          <input type="text" name="customer" required className="input" />
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
        <div className="mt-5">
          <label className="mb-3 block text-base font-medium text-[#07074D]">
            Address
          </label>
          <div>
            <input type="text" name="address" required className="input" />
          </div>
        </div>
        <div className="mt-5 flex items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-4 w-4 accent-yellow-300 focus:ring focus:ring-yellow-300 focus:ring-offset-2"
          />
          <label htmlFor="priority" className="ml-3 font-bold text-stone-800">
            want to yo give your order priority
          </label>
        </div>
        <div className="mt-5">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button type="primary">
            {isSubmitting ? "Placing order...." : "Order now"}
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
    priority: data.priority === "on",
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
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
