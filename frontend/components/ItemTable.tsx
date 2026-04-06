type Item = {
  id: number;
  name: string;
  stock: number;
};

type Props = {
  items: Item[];
  onDelete: (id: number) => void;
};

export default function ItemTable({ items, onDelete }: Props) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded shadow flex justify-between"
        >
          <div>
            <p className="font-bold">{item.name}</p>
            <p>Stock: {item.stock}</p>
          </div>

          <button
            className="bg-red-500 text-white px-3 rounded"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}