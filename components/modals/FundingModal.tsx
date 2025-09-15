import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

interface FundingModalProps {
  visible: boolean;
  onClose: () => void;
  onFund: (amount: number) => void;
  loggedInUser?: { fullName: string; country: string; mobile?: string };
}

const paymentMethods = ['Card', 'Mobile Money', 'Stellar'];
const countries = ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda', 'Burundi'];

const mobileNetworks: Record<string, string[]> = {
  Kenya: ['M-Pesa', 'Airtel Money', 'T-Kash'],
  Uganda: ['MTN Mobile Money', 'Airtel Money'],
  Tanzania: ['Tigo Pesa', 'M-Pesa', 'Airtel Money'],
  Ethiopia: ['TeleBirr', 'HelloCash'],
  Rwanda: ['MTN Mobile Money', 'Airtel Money'],
  Burundi: ['MTN Mobile Money', 'Airtel Money'],
};

const countryCodes: Record<string, string> = {
  Kenya: '+254',
  Uganda: '+256',
  Tanzania: '+255',
  Ethiopia: '+251',
  Rwanda: '+250',
  Burundi: '+257',
};

export default function FundingModal({ visible, onClose, onFund, loggedInUser }: FundingModalProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const [fullName, setFullName] = useState(loggedInUser?.fullName || '');
  const [country, setCountry] = useState(loggedInUser?.country || 'Kenya');
  const [paymentMethod, setPaymentMethod] = useState<string>('Card');
  const [mobileNetwork, setMobileNetwork] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState(loggedInUser?.mobile || '');
  const [stellarWallet, setStellarWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Update mobile network immediately when country or payment method changes
  useEffect(() => {
    if (paymentMethod === 'Mobile Money') {
      const networks = mobileNetworks[country] || [];
      setMobileNetwork(networks[0] || '');
      if (!loggedInUser?.mobile) setMobileNumber(''); // reset if no prefilled mobile
    }
  }, [country, paymentMethod, loggedInUser]);

  const handleFund = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    onFund(amt);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={[styles.container, { backgroundColor: theme.modal }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Text style={[styles.title, { color: theme.text }]}>Fund this Project</Text>

          {/* Full Name */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
            placeholderTextColor={theme.placeholder}
          />

          {/* Country Picker */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Country</Text>
          <View style={[styles.pickerContainer, { borderColor: theme.inputBorder, backgroundColor: theme.input }]}>
            <Picker
              selectedValue={country}
              onValueChange={(value) => setCountry(value)}
              style={[styles.picker, { color: theme.text }]}
            >
              {countries.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/* Payment Method */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodButton,
                  { borderColor: theme.inputBorder, backgroundColor: paymentMethod === method ? theme.primary : theme.input },
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text
                  style={[
                    styles.paymentMethodText,
                    { color: paymentMethod === method ? '#FFFFFF' : theme.text },
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Fields */}
          {paymentMethod === 'Mobile Money' && (
            <>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Mobile Money Network</Text>
              <View style={styles.paymentMethodsContainer}>
                {(mobileNetworks[country] || []).map((network) => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      styles.paymentMethodButton,
                      { borderColor: theme.inputBorder, backgroundColor: mobileNetwork === network ? theme.primary : theme.input },
                    ]}
                    onPress={() => setMobileNetwork(network)}
                  >
                    <Text
                      style={[
                        styles.paymentMethodText,
                        { color: mobileNetwork === network ? '#FFFFFF' : theme.text },
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSecondary }]}>Mobile Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.countryCode, { color: theme.text }]}>{countryCodes[country]}</Text>
                <TextInput
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  style={[styles.input, { flex: 1, marginLeft: 8, borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
                  placeholderTextColor={theme.placeholder}
                />
              </View>
            </>
          )}

          {paymentMethod === 'Card' && (
            <>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Card Number</Text>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric"
                style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
                placeholderTextColor={theme.placeholder}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Expiry</Text>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>CVC</Text>
                  <TextInput
                    value={cardCVC}
                    onChangeText={setCardCVC}
                    placeholder="CVC"
                    keyboardType="numeric"
                    style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
                    placeholderTextColor={theme.placeholder}
                  />
                </View>
              </View>
            </>
          )}

          {paymentMethod === 'Stellar' && (
            <>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Stellar Wallet Address</Text>
              <TextInput
                value={stellarWallet}
                onChangeText={setStellarWallet}
                placeholder="Paste your Stellar wallet"
                style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
                placeholderTextColor={theme.placeholder}
              />
            </>
          )}

          {/* Amount */}
          <Text style={[styles.label, { color: theme.textSecondary }]}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            style={[styles.input, { borderColor: theme.inputBorder, backgroundColor: theme.input, color: theme.text }]}
            placeholderTextColor={theme.placeholder}
          />

          {/* Complete Button */}
          <TouchableOpacity style={[styles.fundButton, { backgroundColor: theme.primary }]} onPress={handleFund}>
            <Text style={[styles.fundButtonText, { color: '#FFFFFF' }]}>Complete Funding</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.gray[200] }]} onPress={onClose}>
            <Text style={[styles.fundButtonText, { color: theme.text }]}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  pickerContainer: { borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  picker: { height: 50, width: '100%' },
  paymentMethodsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  paymentMethodButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  paymentMethodText: { fontSize: 14, fontWeight: '600' },
  countryCode: { fontSize: 14, fontWeight: '600' },
  fundButton: { paddingVertical: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  fundButtonText: { fontWeight: '700', fontSize: 16 },
  cancelButton: { paddingVertical: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' },
});
