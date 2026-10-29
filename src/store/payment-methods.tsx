import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'other';
export type MobileNetwork = 'mtn' | 'airtel' | 'mpesa' | 'orange';

export type CardPaymentMethod = {
  kind: 'card';
  id: string;
  brand: CardBrand;
  last4: string;
  holder: string;
  expiry: string;
  isDefault: boolean;
};

export type MobileMoneyPaymentMethod = {
  kind: 'mobile';
  id: string;
  network: MobileNetwork;
  phone: string;
  holder: string;
  isDefault: boolean;
};

export type PaymentMethod = CardPaymentMethod | MobileMoneyPaymentMethod;

export type NewCardPaymentMethod = Omit<CardPaymentMethod, 'id' | 'isDefault'> & {
  isDefault?: boolean;
};

export type NewMobilePaymentMethod = Omit<MobileMoneyPaymentMethod, 'id' | 'isDefault'> & {
  isDefault?: boolean;
};

export type NewPaymentMethod = NewCardPaymentMethod | NewMobilePaymentMethod;

export type PaymentMethodUpdate =
  | Partial<Omit<CardPaymentMethod, 'id'>>
  | Partial<Omit<MobileMoneyPaymentMethod, 'id'>>;

type PaymentMethodsContextValue = {
  methods: PaymentMethod[];
  defaultMethod: PaymentMethod | undefined;
  addMethod: (method: NewPaymentMethod) => void;
  updateMethod: (id: string, updates: PaymentMethodUpdate) => void;
  removeMethod: (id: string) => void;
  setDefault: (id: string) => void;
  getMethod: (id: string) => PaymentMethod | undefined;
};

const PaymentMethodsContext = createContext<PaymentMethodsContextValue | null>(null);

const INITIAL: PaymentMethod[] = [
  {
    kind: 'card',
    id: 'pm-visa-4242',
    brand: 'visa',
    last4: '4242',
    holder: 'Albert Kay',
    expiry: '09/28',
    isDefault: true,
  },
  {
    kind: 'card',
    id: 'pm-mastercard-8890',
    brand: 'mastercard',
    last4: '8890',
    holder: 'Albert Kay',
    expiry: '03/27',
    isDefault: false,
  },
  {
    kind: 'mobile',
    id: 'pm-mtn-4567',
    network: 'mtn',
    phone: '+256 77 123 4567',
    holder: 'Albert Kay',
    isDefault: false,
  },
];

export const CARD_BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  other: 'Card',
};

export const MOBILE_NETWORK_LABEL: Record<MobileNetwork, string> = {
  mtn: 'MTN Mobile Money',
  airtel: 'Airtel Money',
  mpesa: 'M-Pesa',
  orange: 'Orange Money',
};

export const MOBILE_NETWORK_SHORT_LABEL: Record<MobileNetwork, string> = {
  mtn: 'MTN',
  airtel: 'Airtel',
  mpesa: 'M-Pesa',
  orange: 'Orange',
};

export const MOBILE_NETWORKS: MobileNetwork[] = ['mtn', 'airtel', 'mpesa', 'orange'];

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  return 'other';
}

export function getPaymentMethodLabel(method: PaymentMethod) {
  if (method.kind === 'mobile') {
    const last4 = method.phone.replace(/\D/g, '').slice(-4);
    return `${MOBILE_NETWORK_SHORT_LABEL[method.network]} •• ${last4}`;
  }
  return `${CARD_BRAND_LABEL[method.brand]} •••• ${method.last4}`;
}

function withSingleDefault(
  methods: PaymentMethod[],
  defaultId: string | undefined,
): PaymentMethod[] {
  return methods.map((method) => ({
    ...method,
    isDefault: method.id === defaultId,
  }));
}

export function PaymentMethodsProvider({ children }: { children: ReactNode }) {
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL);

  const addMethod = useCallback((method: NewPaymentMethod) => {
    setMethods((prev) => {
      const makeDefault = method.isDefault || prev.length === 0;
      const created = {
        ...method,
        id: `pm-${Date.now()}`,
        isDefault: makeDefault,
      } as PaymentMethod;
      const next = [...prev, created];
      return makeDefault ? withSingleDefault(next, created.id) : next;
    });
  }, []);

  const updateMethod = useCallback(
    (id: string, updates: PaymentMethodUpdate) => {
      setMethods((prev) => {
        const next = prev.map((method) =>
          method.id === id ? ({ ...method, ...updates } as PaymentMethod) : method,
        );
        return updates.isDefault ? withSingleDefault(next, id) : next;
      });
    },
    [],
  );

  const removeMethod = useCallback((id: string) => {
    setMethods((prev) => {
      const remaining = prev.filter((method) => method.id !== id);
      if (remaining.length === 0 || remaining.some((method) => method.isDefault)) {
        return remaining;
      }
      return withSingleDefault(remaining, remaining[0].id);
    });
  }, []);

  const setDefault = useCallback((id: string) => {
    setMethods((prev) => withSingleDefault(prev, id));
  }, []);

  const defaultMethod = useMemo(
    () => methods.find((method) => method.isDefault) ?? methods[0],
    [methods],
  );

  const getMethod = useCallback(
    (id: string) => methods.find((method) => method.id === id),
    [methods],
  );

  const value = useMemo(
    () => ({
      methods,
      defaultMethod,
      addMethod,
      updateMethod,
      removeMethod,
      setDefault,
      getMethod,
    }),
    [methods, defaultMethod, addMethod, updateMethod, removeMethod, setDefault, getMethod],
  );

  return (
    <PaymentMethodsContext.Provider value={value}>{children}</PaymentMethodsContext.Provider>
  );
}

export function usePaymentMethods() {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodsProvider');
  }
  return context;
}
