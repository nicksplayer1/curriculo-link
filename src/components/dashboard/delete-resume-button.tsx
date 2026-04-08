"use client";

export default function DeleteResumeButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(
          "Tem certeza que deseja excluir este currículo?"
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
    >
      Excluir
    </button>
  );
}
