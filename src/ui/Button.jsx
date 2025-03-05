import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "inline-block rounded-md bg-yellow-300 text-base tracking-wide text-stone-800 font-semibold leading-6 ring-yellow-400 ring-offset-2 transition duration-150 ease-in-out hover:bg-yellow-400 focus:outline-none focus:ring md:px-10 md:py-4 md:text-lg uppercase";

  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " px-4 py-2 md:px-5 md:py-2.5 text-xs ",
    round: base + " px-2.5 py-1 md:px-3.5 md:py-2 text-xs",
    secondary:
      "inline-block rounded-md bg-transparent text-stone-800 border-2 border-stone-300  px-4 py-2.5 md:px-6 md:py-3.5 tracking-wide text-base font-semibold leading-6 ring-stone-400 ring-offset-2 transition duration-150 ease-in-out hover:bg-stone-300 focus:text-stone-800 focus:outline-none focus:ring md:px-10 md:py-4 md:text-lg uppercase",
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
