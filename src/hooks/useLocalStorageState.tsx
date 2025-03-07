import { Dispatch, useEffect, useState } from "react";

function useLocalStorageState<T>(key: string, defaultValue: T): [T,Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default useLocalStorageState