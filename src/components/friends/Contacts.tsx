
const Contacts = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-150px)]">
      <span className="font-semibold mt-4 text-zinc-400 flex gap-2 items-center pt-6 relative overflow-hidden">
        <span>
          Give access to your contact to see results.
        </span>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded text-[16px] duration-150 peer">
          Allow
        </button>
      </span>
    </div>
  )
}

export default Contacts
