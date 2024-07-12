import "./Hello.css";
import classnames from "classnames";
import PropTypes from "prop-types";

export function Hello({ name, count, ...rest }) {
  // const name = "General Kenobi";
  // const name = "React";
  // const count = 3;

  // console.log(props);

  const out = [];
  for (let i = 0; i < count; i++) {
    if (!name) {
      out.push(<h1>Nincs kit üdvözölni!</h1>);
    } else {
      out.push(<h1 className={classnames({ orange: name === "React" })}>Hello {name}!</h1>);
    }
  }

  out.push(rest.children);

  return out;
}

Hello.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
};
