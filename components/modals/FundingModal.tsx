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
import { colors } from '../../constants/colors';

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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <Text style={styles.title}>Fund this Project</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            style={styles.input}
          />

          {/* Country Picker */}
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(value) => setCountry(value)}
              style={styles.picker}
            >
              {countries.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/* Payment Method */}
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === method && styles.paymentMethodSelected,
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text
                  style={[
                    styles.paymentMethodText,
                    paymentMethod === method && { color: colors.white },
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
              <Text style={styles.label}>Mobile Money Network</Text>
              <View style={styles.paymentMethodsContainer}>
                {(mobileNetworks[country] || []).map((network) => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      styles.paymentMethodButton,
                      mobileNetwork === network && styles.paymentMethodSelected,
                    ]}
                    onPress={() => setMobileNetwork(network)}
                  >
                    <Text
                      style={[
                        styles.paymentMethodText,
                        mobileNetwork === network && { color: colors.white },
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Mobile Number</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.countryCode}>{countryCodes[country]}</Text>
                <TextInput
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  style={[styles.input, { flex: 1, marginLeft: 8 }]}
                />
              </View>
            </>
          )}

          {paymentMethod === 'Card' && (
            <>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Expiry</Text>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CVC</Text>
                  <TextInput
                    value={cardCVC}
                    onChangeText={setCardCVC}
                    placeholder="CVC"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>
            </>
          )}

          {paymentMethod === 'Stellar' && (
            <>
              <Text style={styles.label}>Stellar Wallet Address</Text>
              <TextInput
                value={stellarWallet}
                onChangeText={setStellarWallet}
                placeholder="Paste your Stellar wallet"
                style={styles.input}
              />
            </>
          )}

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Complete Button */}
          <TouchableOpacity style={styles.fundButton} onPress={handleFund}>
            <Text style={styles.fundButtonText}>Complete Funding</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={[styles.fundButtonText, { color: colors.gray[700] }]}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    backgroundColor: colors.white,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.gray[700], marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.dark },
  pickerContainer: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 8, marginBottom: 12 },
  picker: { height: 50, width: '100%' },
  paymentMethodsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  paymentMethodButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.gray[300], marginRight: 8, marginBottom: 8 },
  paymentMethodSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  paymentMethodText: { fontSize: 14, fontWeight: '600', color: colors.gray[700] },
  countryCode: { fontSize: 14, fontWeight: '600', color: colors.dark },
  fundButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  fundButtonText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  cancelButton: { paddingVertical: 14, borderRadius: 12, marginTop: 12, alignItems: 'center', backgroundColor: colors.gray[700] },
});
