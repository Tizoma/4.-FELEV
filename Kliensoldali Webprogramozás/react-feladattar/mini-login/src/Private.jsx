const Private = ({ loggedInUser, logout }) => {
  return (
    <div>
      <h1>Szia, {loggedInUser}!</h1>
      <div>Formázott tartalom</div>
      <button className="logoutBtn" onClick={logout}>Kijelentkezés</button>
    </div>
  );
};

export default Private;
