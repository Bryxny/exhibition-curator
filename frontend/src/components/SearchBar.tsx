"use client";

export default function SearchBar({
  setQuery,
}: {
  setQuery: (q: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.q as HTMLInputElement;
    setQuery(input.value);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-4 flex gap-2">
      <input
        type="text"
        name="q"
        placeholder="Search artworks..."
        className="flex-1 border rounded p-2"
      />
      <button className="bg-blue-600 text-white px-4 rounded">Search</button>
    </form>
  );
}
