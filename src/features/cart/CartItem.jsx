import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function CartItem({ item, key }) {
  const { name, quantity, totalPrice } = item;
  return (
    <li key={key} className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <Button type="small">delete</Button>
      </div>
    </li>
  );
}

export default CartItem;
