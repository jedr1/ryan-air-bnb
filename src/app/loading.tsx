import SkeletonCard from "@/components/custom/SkeletonCard";

export default function loading() {
  return (
    <main>
    <div className="grid grid-cols-4 gap-4">
        {"abcdefgh".split('').map((i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
    </main>
  )
}