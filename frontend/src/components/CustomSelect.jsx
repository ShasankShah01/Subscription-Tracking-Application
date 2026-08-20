import React, { useState, useRef, useEffect, useId } from 'react';

/**
 * Reusable CustomSelect Component
 * Replaces all native HTML <select> elements across the application.
 *
 * @param {string|number} value - Currently selected value
 * @param {function} onChange - Callback triggered on selection (receives value or event-like object)
 * @param {Array<string|{value: string|number, label: string, badge?: string, icon?: React.ReactNode, disabled?: boolean}>} options
 * @param {string} [placeholder] - Placeholder text
 * @param {string} [className] - Additional trigger button styling
 * @param {string} [menuClassName] - Additional dropdown menu styling
 * @param {string} [maxHeight] - Max height of dropdown list (default: 'max-h-56')
 * @param {boolean} [disabled=false] - Disabled state
 * @param {string} [size='md'] - 'sm' | 'md'
 * @param {string} [ariaLabel] - Accessibility label
 * @param {React.ReactNode} [renderTrigger] - Custom trigger renderer
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
  menuClassName = '',
  maxHeight = 'max-h-56',
  disabled = false,
  size = 'md',
  ariaLabel,
  renderTrigger,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerId = useId();

  // Normalize options to { value, label, badge, icon, disabled }
  const normalizedOptions = (options || []).map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label ?? String(opt.value),
        badge: opt.badge,
        icon: opt.icon,
        disabled: Boolean(opt.disabled),
      };
    }
    return {
      value: opt,
      label: String(opt),
      disabled: false,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Click-outside listener to prevent memory leaks and close dropdowns reliably
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (e, optionValue) => {
    e?.stopPropagation?.();
    if (disabled) return;
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';

  return (
    <div ref={dropdownRef} className="relative w-full inline-block text-left">
      {/* Trigger Button */}
      {renderTrigger ? (
        renderTrigger({
          isOpen,
          setIsOpen: (e) => {
            e?.stopPropagation?.();
            if (!disabled) setIsOpen(!isOpen);
          },
          selectedOption,
          value,
          disabled,
        })
      ) : (
        <button
          id={triggerId}
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || placeholder}
          className={`w-full flex items-center justify-between gap-2 rounded-xl text-left font-medium transition-all duration-300 ease-out cursor-pointer select-none
            bg-white dark:bg-zinc-950/70 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-[#F7E7CE]
            shadow-sm dark:shadow-inner
            focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 focus:border-transparent
            disabled:opacity-40 disabled:cursor-not-allowed
            ${sizeClasses} ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            <span className="truncate">
              {selectedOption ? selectedOption.label : (
                <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
              )}
            </span>
          </div>

          <svg
            className={`w-4 h-4 shrink-0 text-slate-400 dark:text-[#F7E7CE]/60 transition-transform duration-300 ease-out ${
              isOpen ? 'rotate-180 text-amber-500 dark:text-[#F7E7CE]' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={triggerId}
          className={`absolute left-0 top-full mt-1.5 w-full min-w-[160px] ${maxHeight} overflow-y-auto rounded-2xl z-50 p-1.5 space-y-0.5
            bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-[#F7E7CE]/20
            shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)]
            animate-in fade-in zoom-in-95 duration-150
            custom-scrollbar ${menuClassName}`}
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!option.disabled) handleSelect(e, option.value);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600 to-amber-500 text-white shadow-sm font-bold'
                        : 'text-slate-700 dark:text-[#F7E7CE] hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                    }
                    ${option.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {option.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#F7E7CE]'
                      }`}>
                        {option.badge}
                      </span>
                    )}

                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
