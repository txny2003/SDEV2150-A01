import { useState } from 'react';


/* sessionStorage is a key-value store, built in to web behaviour (no need to import anything). 
   Below, I'm defining which 'key' I'll be writing the resource value to.
*/
const STORAGE_KEY = 'selectedResource'


/* This will be a custom hook built *around* useState.

   We're going to change a stateful variable, *but also*
   read/write changes from/to persisted session storage.

   This is why we're using a custom hook in the first place -- 
   we want to work with state, but also do related i/o with
   an external system.
*/
export function useSelectedResource() {

	const [selectedResource, setSelectedResource] = useState(
		null // We are going update this initial value so it reads from persistent storage.
	);

	function updateSelectedResource(resource) {
		// 1. change the value in React state via setter
		setSelectedResource(resource);

		// 2. also write the value to persistent storage
		// 2.a) if 'resource' is null, remove the key from sessionStorage entirely.
		if (resource === null) {
			sessionStorage.removeItem(STORAGE_KEY)
		} else {
		// 2.b) if 'resource' is/has data, write it to that key.
			sessionStorage.setItem(
				STORAGE_KEY,             // key in session storage
				JSON.stringify(resource) // value in session storage. note: it's JSON!
			)
		}
 	}

	return [selectedResource, updateSelectedResource]
}
