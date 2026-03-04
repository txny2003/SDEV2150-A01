// react hooks
import { useState } from 'react';

// my components
import Card from './ui/Card';

// src/components/Filters.jsx
export default function Filters() {

  const [searchTerm, setSearchTerm] = useState('')
  // because we're selecting multiple categories at once, it makes sense to use an array
  const [selectedCategories, setSelectedCategories] = useState([])
  const [openNow, setOpenNow] = useState(false)
  const [virtual, setVirtual] = useState(false)

  function resetForm() {
    // here, I'm just looking to restore all stateful elements to their default values
    setSearchTerm('')
    setSelectedCategories([])
    setOpenNow(false)
    setVirtual(false)
  }

  function toggleCategory(category) {
    // when I get a category, that means it's been clicked.
    // 1.   look in my stateful array to see if that category label is already there.
    // 2.a) -> it's not -> I want to add it to the stateful array of selected categories
    // 2.b) -> it is    -> I want to remove it from that array

    // caveat: state variables are *immutable*, so I can't just push and remove from an array;
    //         I have to reconstruct the array entirely and then pass that array into the setter.
    // outcome: -> I'll just use [].filter() to reconstruct it entirely
    //          -> Since this isn't terribly complex, let's just do it all as a one-off inside the setter input.
    setSelectedCategories(
      (prev) => {
        // 2.b) the category label is in the stateful array (i.e. selected)
        //      -> reconstruct the entire array with that term filtered out
        if (prev.includes(category)) {
          return prev.filter(
            (c) => c !== category
          );
        }

        // 2.a) the category label is *not* already in the stateful array (i.e. not selected)
        //      -> we're using the ...spread operator, which unpacks an array into a flat series of terms,
        //         so that we get e.g. [1, 2, 3, category] instead of [prev, category] which would give us [[1, 2, 3], category]
        return [...prev, category]
      }
    )
  }

  return (
    <Card title="Filters">
      <div className="space-y-4 p-4">
        <form id="frm-filter" className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="q" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="q"
              type="text"
              placeholder="Try: tutoring, mental health, bursary"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              onChange={(e) => {setSearchTerm(e.target.value)}}
              value={searchTerm}
            />
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-800">Category</div>
            <div className="flex flex-wrap gap-2" aria-label="Category filters">
              {['All', 'Academic', 'Wellness', 'Financial', 'Tech'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`${selectedCategories.includes(label) && 'bg-sky-600 text-white'} rounded border border-sky-600 px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50`}
                  onClick={() => toggleCategory(label)}
                >
                  {/* Above, we're using the && (and) operator to conditionally render activet state on the buttons!
                      -> somethingResolvesTruthy && thenAlsoDothis
                      -> we can leverage this to dynamically add styles based on e.g. the click state of the button, as tracked in the array

                      This is shorthand that's useful if there's no 'else' case to render. Here, we don't need to do anything
                      if the button is inactive. *If* we had a case where we wanted to render either A or B, we'd use a ternary.
                  */}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="openNow"
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                onChange={(e) => setOpenNow(e.target.checked)}
                value={openNow}
              />
              Open now
            </label>
            <p className="text-sm">
              Open now is selected: {openNow ? 'Yes' : 'No'}
            </p>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                id="virtual"
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                onChange={(e) => setVirtual(e.target.checked)}
                value={virtual}
              />
              Virtual options
            </label>
            <p className="text-sm">
              Virtual is selected: {virtual ? 'Yes' : 'No'}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => resetForm()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
    </Card >
  );
}
