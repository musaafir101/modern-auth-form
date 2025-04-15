import { useState } from "react";
import AuthForm from "./components/AuthForm";
import Toast from "./components/Toast";

function App() {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-poppins">
      {/* Background Image Section */}
      <div className="md:w-1/2 bg-cover bg-center h-64 md:h-screen relative overflow-hidden">
        <img
          src="/images/auth-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-600/30 flex items-center justify-center">
          <div className="text-center p-5">
            <div className="flex justify-center mb-4">
              <img src="/images/demo.png" alt="Logo" className="h-16" />
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-white text-lg md:text-xl max-w-md mx-auto drop-shadow-md">
              Sign in to continue your journey with us and explore all our
              amazing features.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-5 bg-gray-50">
        <AuthForm showToast={showToast} />
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default App;
