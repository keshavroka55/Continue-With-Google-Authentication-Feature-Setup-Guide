export default function Alert({ message, type }) {
    if (!message) return null;

    return (
        <div className={`mb-4 p-3 rounded-xl border text-sm ${type === "error"
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-green-50 border-green-200 text-green-600"
            }`}>
            {message}
        </div>
    );
}
