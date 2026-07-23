import React, { createContext, useState } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (product) => {
    const exists = compareList.some((p) => p._id === product._id);

    if (exists) {
      setCompareList(compareList.filter((p) => p._id !== product._id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare up to 4 luxury items side-by-side.');
        return;
      }
      setCompareList([...compareList, product]);
      setIsCompareOpen(true);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter((p) => p._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
