import SkeletonCard from "@/components/custom/SkeletonCard";

export default function LoadingSkeleton() {
  return (
    <main>
    <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        {"abcdefgh".split('').map((i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
    </main>
  )
}