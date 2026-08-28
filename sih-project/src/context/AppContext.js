import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [violations, setViolations] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const [isScanning, setIsScanning] = useState(false);

  const [notification, setNotification] = useState(null);

  // Add a product
  const addProduct = (product) => {
    const newProduct = {
      id: Date.now(),
      ...product,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);

    return newProduct;
  };

  // Remove a product
  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  // Update product
  const updateProduct = (productId, updates) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  };

  // Add violation
  const addViolation = (violation) => {
    const newViolation = {
      id: Date.now(),
      status: "Open",
      date: new Date().toLocaleDateString(),
      ...violation,
    };

    setViolations((currentViolations) => [
      ...currentViolations,
      newViolation,
    ]);

    return newViolation;
  };

  // Resolve violation
  const resolveViolation = (violationId) => {
    setViolations((currentViolations) =>
      currentViolations.map((violation) =>
        violation.id === violationId
          ? {
              ...violation,
              status: "Resolved",
            }
          : violation
      )
    );
  };

  // Start scanning
  const startScan = () => {
    setIsScanning(true);
  };

  // Stop scanning
  const stopScan = () => {
    setIsScanning(false);
  };

  // Show notification
  const showNotification = ({
    type = "info",
    title,
    message,
  }) => {
    setNotification({
      type,
      title,
      message,
    });
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(null);
  };

  const value = useMemo(
    () => ({
      products,
      violations,

      selectedProduct,
      setSelectedProduct,

      selectedEvidence,
      setSelectedEvidence,

      isScanning,

      notification,

      addProduct,
      removeProduct,
      updateProduct,

      addViolation,
      resolveViolation,

      startScan,
      stopScan,

      showNotification,
      hideNotification,
    }),
    [
      products,
      violations,
      selectedProduct,
      selectedEvidence,
      isScanning,
      notification,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside an AppProvider"
    );
  }

  return context;
}