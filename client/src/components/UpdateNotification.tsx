import { useAutoUpdate } from '@/hooks/use-auto-update';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export function UpdateNotification() {
  const { updateAvailable, applyUpdate, dismissUpdate } = useAutoUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-amber-900">
              Update Available
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              A new version of Essence Yogurt is ready. Refresh to enjoy the latest features.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={applyUpdate}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs h-8"
                data-testid="button-apply-update"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Update Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismissUpdate}
                className="text-amber-700 hover:bg-amber-100 text-xs h-8"
                data-testid="button-dismiss-update"
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={dismissUpdate}
            className="text-amber-400 hover:text-amber-600"
            data-testid="button-close-update"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
