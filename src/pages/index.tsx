import { Link } from "react-router-dom";

import { FaUserFriends, FaPlay } from "react-icons/fa";

type HomeMenuSelectorItemProps = {
  to: string,
  title: string,
  description: string,
  iconElement: React.ReactNode
};

const HomeMenuSelectorItem = ({
  to,
  title,
  description,
  iconElement
}: HomeMenuSelectorItemProps) => {
  return (
    <Link to={to} className="relative px-6 py-4 pr-12 transition-colors bg-zinc-900 bg-opacity-40 w-full rounded-md hover:bg-opacity-80">
      <h2 className="text-xl">{title}</h2>
      <p className="text-zinc-400">{description}</p>

      <span className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-900">{iconElement}</span>
    </Link>
  );
};

export default function HomePage () {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-2xl">osu! web player</h1>
        <p>Made with ❤️ by <a className="text-purple-300 hover:underline underline-offset-2" href="https://github.com/Vexcited" target="_blank" rel="noreferrer">Vexcited</a></p>
      </div>

      <div className="grid place-items-center gap-2 mx-4">
        <HomeMenuSelectorItem
          to="/singleplayer"
          title="Single Player"
          description="Import maps and play them !"
          iconElement={<FaPlay />}
        />

        <HomeMenuSelectorItem
          to="/multiplayer"
          title="Multiplayer"
          description="Play with your friends !"
          iconElement={<FaUserFriends />}
        />
      </div>

      <Link className="px-6 py-2 rounded-full focus:bg-opacity-80 hover:bg-opacity-80 transition-colors bg-purple-500 text-purple-50" to="settings">
        Global Settings
      </Link>
    </main>
  );
}