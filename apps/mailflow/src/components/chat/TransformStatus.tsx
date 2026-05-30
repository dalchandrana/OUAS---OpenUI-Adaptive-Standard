import { Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { ValidationResult } from '@ouas/validator';
import './TransformStatus.css';

export type TransformState = 'idle' | 'generating' | 'validating' | 'success' | 'error';

interface TransformStatusProps {
  state: TransformState;
  validationResult?: ValidationResult | null;
  errorMessage?: string;
  onDismiss?: () => void;
}

export function TransformStatus({ state, validationResult, errorMessage, onDismiss }: TransformStatusProps) {
  if (state === 'idle') return null;

  return (
    <div className={`transform-status ${state}`}>
      <div className="status-header">
        <div className="status-indicator">
          {(state === 'generating' || state === 'validating') && <Loader2 className="spinner" size={20} />}
          {state === 'success' && <CheckCircle2 className="success-icon" size={20} />}
          {state === 'error' && (validationResult?.valid ? <AlertTriangle className="warning-icon" size={20} /> : <XCircle className="error-icon" size={20} />)}
        </div>
        <div className="status-title">
          {state === 'generating' && 'Agent is designing your layout...'}
          {state === 'validating' && 'Validating layout against OUAS manifest...'}
          {state === 'success' && 'Layout applied successfully!'}
          {state === 'error' && 'Failed to apply layout'}
        </div>
        {onDismiss && (state === 'success' || state === 'error') && (
          <button className="dismiss-btn" onClick={onDismiss}>Dismiss</button>
        )}
      </div>

      {state === 'error' && errorMessage && (
        <div className="status-error-message">
          {errorMessage}
        </div>
      )}

      {/* Show Validation Results if we have them */}
      {(state === 'success' || state === 'error') && validationResult && (
        <div className="validation-details">
          {validationResult.migration_applied && (
            <div className="validation-section migration">
              <strong>Migration Applied</strong>
              <ul>
                {validationResult.migration_warnings?.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validationResult.errors.length > 0 && (
            <div className="validation-section errors">
              <strong>Errors ({validationResult.errors.length})</strong>
              <ul>
                {validationResult.errors.map((e, i) => (
                  <li key={i}>
                    {e.message}
                    {e.suggestion && <span className="suggestion">💡 {e.suggestion}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {validationResult.warnings.length > 0 && (
            <div className="validation-section warnings">
              <strong>Warnings ({validationResult.warnings.length})</strong>
              <ul>
                {validationResult.warnings.map((w, i) => (
                  <li key={i}>{w.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
