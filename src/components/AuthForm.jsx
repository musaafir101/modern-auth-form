import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";

const AuthForm = ({ showToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset errors when switching between login and signup
  useEffect(() => {
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [isLogin]);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(String(password));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
    }

    // Additional validations for signup
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isLogin) {
        // Handle login
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u) => u.email === formData.email);

        if (user && user.password === formData.password) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          showToast("Login successful!", "success");
        } else {
          showToast("Invalid email or password", "error");
        }
      } else {
        // Handle signup
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Check if email already exists
        if (users.some((user) => user.email === formData.email)) {
          showToast("Email already registered", "error");
          return;
        }

        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        showToast("Account created successfully!", "success");

        // Switch to login after successful signup
        setTimeout(() => setIsLogin(true), 1000);
      }
    } else {
      showToast("Please fix the errors in the form", "error");
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="relative bg-gray-200 p-1 rounded-full flex w-full max-w-xs">
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
            initial={{ width: "calc(50% - 5px)", x: isLogin ? 0 : "100%" }}
            animate={{ x: isLogin ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "50%" }}
          />
          <button
            onClick={() => setIsLogin(true)}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
              isLogin ? "text-white" : "text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
              !isLogin ? "text-white" : "text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {isLogin ? "Login to your account" : "Create a new account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field (Sign Up only) */}
        {!isLogin && (
          <div>
            <div
              className={`relative rounded-full overflow-hidden border transition-all ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-purple-500"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="block w-full pl-10 pr-3 py-3 border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.name}
              </motion.p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div>
          <div
            className={`relative rounded-full overflow-hidden border transition-all ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus-within:border-purple-500"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="block w-full pl-10 pr-3 py-3 border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div
            className={`relative rounded-full overflow-hidden border transition-all ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 focus-within:border-purple-500"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="block w-full pl-10 pr-10 py-3 border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Confirm Password Field (Sign Up only) */}
        {!isLogin && (
          <div>
            <div
              className={`relative rounded-full overflow-hidden border transition-all ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 focus-within:border-purple-500"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="block w-full pl-10 pr-10 py-3 border-0 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>
        )}

        {/* Forgot Password (Login only) */}
        {isLogin && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r cursor-pointer from-purple-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isLogin ? "Login" : "Sign Up"}
        </motion.button>
      </form>
    </div>
  );
};

export default AuthForm;
