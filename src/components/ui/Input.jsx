import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  placeholder,
  register,
  name,
  className = '',
  style: extraStyle,
  ...rest
}) {
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type

  const borderColor = error
    ? focused ? 'rgba(239,68,68,0.7)' : 'rgba(239,68,68,0.5)'
    : focused ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'

  const bgColor = error
    ? focused ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.04)'
    : focused ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.04)'

  const boxShadow = focused
    ? error ? '0 0 0 3px rgba(239,68,68,0.12)' : '0 0 0 3px rgba(99,102,241,0.12)'
    : 'none'

  const registered = register ? register(name) : {}
  const { onBlur: registeredOnBlur, ...registeredRest } = registered

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9898a8',
            display: 'block',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {LeftIcon && (
          <div style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? '#818cf8' : '#5a5a6e',
            pointerEvents: 'none',
            transition: 'color 0.2s ease',
            display: 'flex', alignItems: 'center',
          }}>
            <LeftIcon size={15} />
          </div>
        )}

        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          style={{
            width: '100%',
            borderRadius: 8,
            border: `1px solid ${borderColor}`,
            background: bgColor,
            color: '#f0f0f5',
            fontSize: 14,
            fontFamily: 'Inter, -apple-system, sans-serif',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow,
            paddingLeft: LeftIcon ? 42 : 16,
            paddingRight: isPassword || RightIcon ? 42 : 16,
            paddingTop: 12,
            paddingBottom: 12,
            ...extraStyle,
          }}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); registeredOnBlur?.(e) }}
          {...registeredRest}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: '#5a5a6e',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              padding: 0,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#9898a8' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5a5a6e' }}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}

        {!isPassword && RightIcon && (
          <div style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: '#5a5a6e',
            pointerEvents: 'none',
            display: 'flex', alignItems: 'center',
          }}>
            <RightIcon size={15} />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ fontSize: 12, color: '#5a5a6e', marginTop: 2 }}>{hint}</p>
      )}
    </div>
  )
}
