import AdminSetup from "./components/AdminSetup";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className=" block bg-[#5250C7] p-4 w-screen min-h-screen">
      <Navbar />
      <AdminSetup />
    </main>
  );
}
