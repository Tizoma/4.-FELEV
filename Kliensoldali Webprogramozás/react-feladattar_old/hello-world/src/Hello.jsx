import classNames from "classnames";
import "./Hello.css";
import PropTypes from "prop-types";

export function Hello({ name, count, ...rest }) {
  //const name = "Valaki";
  //const count = 3;
  const out = [];
  for (let i = 0; i < count; i++) {
    if (!name) {
      out.push(
        <h1 className="red" key={i}>
          Nincs kit üdvözölni
        </h1>
      );
    } else {
      out.push(
        <h1 className={classNames({ orange: name === "React" })} key={i}>
          Hello {name}
        </h1>
      );
    }
  }

  //ezzel a helloban lévő dolgokat is kiírja
  out.push(rest.children);
  //return tud jsx elemek array-ét is visszaadni
  return out;

  //<>-be kell ha több dolgot akarunk visszaadni mert a return 1 jsx elemet vár
  /*
  if (!name) {
    return <h1 className="red">Nincs kit üdvözölni</h1>;
  }
  return (
    <>
      <h1 className="red">Hello {name}!</h1>
    </>
  );
  // class helyett classname
  
     if (!name) {
      out.push(<h1 className=(classNames = ({ orange: name === "React" }))> No name</h1>);
    } else {
      out.push(<h1 className=(classNames = ({ orange: name === "React" }))> Hello {name}!</h1>);
    }
  
  */
}

//ha a propok miatt sírna
Hello.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
};
