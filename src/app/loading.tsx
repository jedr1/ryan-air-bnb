import ClipLoader from "react-spinners/ClipLoader";

export default function loading() {
  return (
    <main className="w-full h-[80vh] flex items-center justify-center">
    <ClipLoader color="#436ad3" />
    </main>
  )
}