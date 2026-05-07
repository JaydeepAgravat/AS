import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '@config/colors';
import { FONTS } from '@config/fonts';
import { rms, rs } from '@utils/scaling';
import AppText from './AppText';

interface CommonPopupProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
  isDanger?: boolean;
}

const CommonPopup = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonColor,
  isDanger = false,
}: CommonPopupProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      navigationBarTranslucent
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              {/* Header */}
              <View style={styles.header}>
                <AppText style={styles.title}>{title}</AppText>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Message */}
              <View style={styles.messageContainer}>
                <AppText style={styles.message}>{message}</AppText>
              </View>

              {/* Buttons Container */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <AppText style={styles.cancelButtonText}>
                    {cancelText}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    {
                      backgroundColor:
                        confirmButtonColor ||
                        (isDanger ? COLORS.error.main : COLORS.primary.main),
                    },
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <AppText style={styles.confirmButtonText}>
                    {confirmText}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.component.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: rs(12),
    width: '80%',
    maxWidth: rs(300),
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingHorizontal: rs(20),
    paddingVertical: rs(16),
  },
  title: {
    fontSize: rms(18),
    fontFamily: FONTS.MANROPE_BOLD,
    color: COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.primary,
  },
  messageContainer: {
    paddingHorizontal: rs(20),
    paddingVertical: rs(16),
  },
  message: {
    fontSize: rms(14),
    fontFamily: FONTS.MANROPE_REGULAR,
    color: COLORS.text.secondary,
    lineHeight: rms(20),
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
  },
  button: {
    flex: 1,
    paddingVertical: rs(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background.secondary,
    borderRightWidth: 1,
    borderRightColor: COLORS.border.primary,
  },
  cancelButtonText: {
    fontSize: rms(14),
    fontFamily: FONTS.MANROPE_MEDIUM,
    color: COLORS.text.primary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary.main,
  },
  confirmButtonText: {
    fontSize: rms(14),
    fontFamily: FONTS.MANROPE_MEDIUM,
    color: COLORS.white,
  },
});

export default CommonPopup;
