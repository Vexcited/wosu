import { Link } from "react-router-dom";

export default function HomePage () {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is the home page</p>

      <Link to={"/singleplayer"}>Single Player</Link>
      <Link to={"/multiplayer"}>Multi Player</Link>
    </div>
  );
}