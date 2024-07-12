const Private = ({ loggedInUser }) => {
  return (
    <div>
      <h1>Szia, {loggedInUser}!</h1>
      <div>Formázott tartalom</div>
      <button className="logoutBtn">Kijelentkezés</button>
    </div>
  );
};

export default Private;
