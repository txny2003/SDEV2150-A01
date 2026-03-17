import { useEffect, useState } from 'react';


const API_BASE_URL = 'http://localhost:3000';  // our local backend REST API


export function useResources() {
    console.log("firing hook!!!")
    // 1. state
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // so we can conditionally render e.g. loading msg
    const [error, setError]         = useState(null);  // so we can conditionally render error msgs

    /* We're going to update our fetch handling to use signals / abort controllers.
       docs: https://developer.mozilla.org/en-US/docs/Web/API/AbortController

         const ac = new AbortController()
         -> ac.signal  : an AbortSignal() instance, which can be used to talk to or kill an async operation
         -> ac.abort() : aborts any async operation (e.g. fetch, consuming Promises, etc.)

      In this example, I'll use this to control fetches/refetches e.g. to make sure I'm not spamming multiple
      fetches. If I want to rerun my effect below, its 'cleanup logic' will be aborting the existing async fetch.

      Real-world example: users clicks a Load button a million times.
      -> we just want to fire that entire behaviour chain (API fetch -> component re-render w/ new data) once.
    */

    // 2. fetch function
    async function fetchResources(signal) { // adding a signal param to this inner function
      // If I'm initiating a fetch, loading/error states should reset
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE_URL}/resources`,
          {signal} // you can pass various things into the 2nd-param object for fetch,
          // but all I need/want here is just a signal object that I can use to abort an ongoing async fetch
        );

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setResources(data);
      } catch (err) {
        if (err.name !== 'AbortError') { // AbortError is intended/expected upon aborting a fetch
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // 3. effect
    useEffect(
        // param 1: the callback
        () => {
          // setup logic
          const controller = new AbortController();
          fetchResources(controller.signal);

          // now I can set up a cleanup method (let's assume this effect is meant to re-fire)
          // that will cancel out any ongoing fetches if the the effect is meant to re-fire.
          return () => {
            // logic that should fire on cleanup, i.e. first thing before effect re-fires with fresh props/state
            controller.abort() // will cancel ongoing fetch
          }
        },
        // param 2: dependency array
        []  // -> only fire effect when page loads
    )

    // 4. function to refresh data
    function refetch() {
        // from this hook, I also want to return a way to refresh resources
        const controller = new AbortController()
        fetchResources(controller.signal);
    }

    // I'm returning an overall object from this hook that contains:
    return { resources, isLoading, error, refetch }
}