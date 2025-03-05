import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCardPrice, getTotalCardQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  // Redux Hook useSelector
  const totalCartQuantity = useSelector(getTotalCardQuantity);
  const totalCardPrice = useSelector(getTotalCardPrice);

  if (!totalCartQuantity) return null;

  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-3 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCardPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
