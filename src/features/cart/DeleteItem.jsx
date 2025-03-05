import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();

  return (
    <div>
      <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
        delete
      </Button>
    </div>
  );
}

export default DeleteItem;
