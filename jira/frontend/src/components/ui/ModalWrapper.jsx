"use client";

export default function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-2 right-2 text-black"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
