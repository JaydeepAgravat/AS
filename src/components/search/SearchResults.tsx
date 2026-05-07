import { StyleSheet } from 'react-native';
import AppText from '@components/shared/AppText';
import { COLORS } from '@config/colors';
import { rms, rs } from '@utils/scaling';

interface SearchResultsProps {
  count: number;
  query: string;
}

const SearchResults = ({ count, query }: SearchResultsProps) => {
  if (query.trim().length === 0) return null;

  return (
    <AppText style={styles.text}>
      {count} result{count !== 1 ? 's' : ''} for "{query}"
    </AppText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: rms(12),
    color: COLORS.text.tertiary,
    marginHorizontal: rs(16),
    marginBottom: rs(2),
  },
});

export default SearchResults;
