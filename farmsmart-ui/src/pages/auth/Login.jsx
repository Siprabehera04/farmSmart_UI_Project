import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Sprout, Leaf, CheckCircle, ArrowRight, Eye, EyeOff, Fingerprint, Mail, UserCog } from 'lucide-react';

// Custom components (inline for completeness)
const AuthInput = ({ label, name, value, onChange, onBlur, placeholder, icon: Icon, error, required }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-emerald-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-xl border-2 bg-white/50 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${
          Icon ? 'pl-10' : 'pl-4'
        } ${
          error
            ? 'border-red-300 focus:border-red-400'
            : 'border-emerald-100 focus:border-emerald-400'
        }`}
      />
    </div>
    {error && <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{error}</p>}
  </div>
);

const PasswordInput = ({ label, name, value, onChange, onBlur, placeholder, icon: Icon, error, required, isVisible, onToggleVisibility }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-emerald-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        type={isVisible ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-xl border-2 bg-white/50 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${
          Icon ? 'pl-10' : 'pl-4'
        } pr-10 ${
          error
            ? 'border-red-300 focus:border-red-400'
            : 'border-emerald-100 focus:border-emerald-400'
        }`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{error}</p>}
  </div>
);

const AuthButton = ({ children, isLoading, type = 'submit', onClick, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading}
    className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
  >
    {isLoading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>Logging in...</span>
      </div>
    ) : (
      <div className="flex items-center justify-center">
        {children}
      </div>
    )}
  </button>
);

export default function Login({ onSubmit, onToggleAuth }) {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'farmer',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [touched, setTouched] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value.trim())) return 'Enter a valid phone number';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['phone', 'password', 'role'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Mark all fields as touched
    setTouched({ phone: true, password: true, role: true });
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ ...formData, rememberMe });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  };

  const handleBiometricLogin = () => {
    // Implement biometric login logic
    console.log('Biometric login clicked');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/30 to-lime-50 px-4 py-10">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-lime-200/35 blur-3xl"
        />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
        
        {/* Floating leaf decorations */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 8 + i, repeat: Infinity, delay: i * 1.5 }}
            className="absolute"
            style={{ left: `${10 + (i * 15)}%`, top: `${70 + (i % 3) * 15}%` }}
          >
            <Leaf className="h-6 w-6 text-emerald-400/30" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[500px] mx-auto"
      >
        {/* Card glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/20 to-lime-400/20 blur-xl" />
        
        <div className="relative rounded-3xl border border-emerald-100/50 bg-white/90 p-8 shadow-2xl shadow-emerald-100/50 backdrop-blur-md">
          {/* Header with animated icon */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-300/50"
            >
              <Sprout className="h-8 w-8" aria-hidden="true" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
            >
              FarmSmart AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-sm text-slate-500"
            >
              Welcome back to your smart farming assistant
            </motion.p>
          </div>

          {/* Features badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            {['AI Insights', 'Real-time Data', 'Smart Alerts'].map((feature, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/50"
              >
                <CheckCircle className="h-3 w-3" />
                {feature}
              </motion.span>
            ))}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AuthInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+1 234 567 8900"
                icon={Phone}
                error={errors.phone}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password}
                required
                isVisible={isPasswordVisible}
                onToggleVisibility={() => setIsPasswordVisible((prev) => !prev)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Login As</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <UserCog className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-emerald-100 bg-white/50 py-2.5 pl-10 pr-4 text-slate-800 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    <option value="admin">Admin</option>
                    <option value="farmer">Farmer</option>
                    <option value="serviceProvider">Service Provider</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Remember me and Forgot password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 rounded border-2 border-emerald-300 bg-white transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-400/40"></div>
                  <CheckCircle className="absolute left-0.5 top-0.5 h-3 w-3 text-white opacity-0 transition-all peer-checked:opacity-100" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-emerald-600 transition-all hover:text-emerald-800 hover:underline"
              >
                Forgot password?
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-3"
            >
              <AuthButton type="submit" isLoading={isLoading} className="group">
                <span>Login to Account</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </AuthButton>
            </motion.div>
          </form>

          {/* Biometric login option */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-4"
          >
            <button
              type="button"
              onClick={handleBiometricLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-100 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-slate-800"
            >
              <Fingerprint className="h-4 w-4" />
              Use biometric login
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/90 px-3 text-slate-400">or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-100 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-100 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md"
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
                </svg>
                Facebook
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-2 text-center"
          >
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              {onToggleAuth ? (
                <button
                  type="button"
                  onClick={onToggleAuth}
                  className="group relative font-semibold text-emerald-600 transition-all hover:text-emerald-800"
                >
                  Register
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
                </button>
              ) : (
                <a href="/register" className="group relative font-semibold text-emerald-600 transition-all hover:text-emerald-800">
                  Register
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
                </a>
              )}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              By logging in, you agree to our{' '}
              <a href="#" className="text-emerald-600 hover:underline transition-all">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-emerald-600 hover:underline transition-all">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}