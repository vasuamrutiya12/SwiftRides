function ItemsPerPageSelector({ itemsPerPage, onItemsPerPageChange }) {
  const options = [5,10, 25]
  
  return (
    <div className="flex items-center gap-2 mx-5">
      <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
        Show:
      </label>
      <select
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">per page</span>
    </div>
  )
}

export default ItemsPerPageSelector