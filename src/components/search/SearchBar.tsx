import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search products...',
}: SearchBarProps) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.icon}>🔍</AppText>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {Platform.OS === 'android' && value.length > 0 ? (
        <TouchableOpacity onPress={handleClear}>
          <AppText style={styles.clearBtn}>✕</AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.card,
    marginHorizontal: rs(16),
    marginTop: rs(12),
    marginBottom: rs(4),
    borderRadius: rs(12),
    paddingHorizontal: rs(12),
    height: rs(46),
    borderWidth: 1.5,
    borderColor: COLORS.border.primary,
    gap: rs(8),
  },
  icon: { fontSize: rms(15) },
  input: {
    flex: 1,
    fontSize: rms(15),
    color: COLORS.text.primary,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: rms(14),
    color: COLORS.text.placeholder,
    padding: rs(4),
  },
});

export default SearchBar;
