import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const MUTED = '#C4CBC7';

export const RecycleMark = ({ light = true }: { light?: boolean }) => (
  <Image
    source={require('../../../assets/recycle.png')}
    style={[styles.recycle, light ? styles.recycleLight : null]}
  />
);

export const MailIcon = () => (
  <View style={styles.mail}>
    <View style={styles.mailFlap} />
  </View>
);

export const LockIcon = () => (
  <View style={styles.lockWrap}>
    <View style={styles.shackle} />
    <View style={styles.lockBody} />
  </View>
);

export const EyeIcon = ({ hidden = false }: { hidden?: boolean }) => (
  <View style={styles.eyeWrap}>
    <View style={styles.eyeOuter}>
      <View style={styles.eyeDot} />
    </View>
    {hidden ? <View style={styles.eyeSlash} /> : null}
  </View>
);

export const PersonIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={styles.personWrap}>
    <View style={[styles.personHead, { borderColor: color }]} />
    <View style={[styles.personBody, { borderColor: color }]} />
  </View>
);

export const ChevronIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={[styles.chevron, { borderColor: color }]} />
);

export const SearchIcon = () => (
  <View style={styles.searchWrap}>
    <View style={styles.searchCircle} />
    <View style={styles.searchHandle} />
  </View>
);

export const TargetIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={[styles.targetOuter, { borderColor: color }]}>
    <View style={[styles.targetMid, { borderColor: color }]}>
      <View style={[styles.targetDot, { backgroundColor: color }]} />
    </View>
  </View>
);

export const FilterIcon = () => (
  <View style={styles.filterWrap}>
    <View style={[styles.filterLine, { width: 14 }]} />
    <View style={[styles.filterLine, { width: 10 }]} />
    <View style={[styles.filterLine, { width: 6 }]} />
  </View>
);

export const LeafIcon = () => (
  <View style={styles.leaf}>
    <View style={styles.leafVein} />
  </View>
);

export const ListTabIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={styles.tabGlyph}>
    <View style={[styles.listBar, { backgroundColor: color }]} />
    <View style={[styles.listBar, { backgroundColor: color }]} />
    <View style={[styles.listBar, { backgroundColor: color, width: 12 }]} />
  </View>
);

export const MapTabIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={[styles.pin, { borderColor: color }]}>
    <View style={[styles.pinDot, { backgroundColor: color }]} />
  </View>
);

export const CameraTabIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={[styles.camBody, { borderColor: color }]}>
    <View style={[styles.camLens, { borderColor: color }]} />
  </View>
);

export const PlusIcon = ({ color = '#fff' }: { color?: string }) => (
  <View style={styles.plusWrap}>
    <View style={[styles.plusBar, { backgroundColor: color }]} />
    <View style={[styles.plusBarVert, { backgroundColor: color }]} />
  </View>
);

export const PencilIcon = ({ color = '#fff' }: { color?: string }) => (
  <View style={[styles.pencil, { borderColor: color, backgroundColor: color }]} />
);

export const TrashIcon = ({ color = '#E74C3C' }: { color?: string }) => (
  <View style={styles.trashWrap}>
    <View style={[styles.trashLid, { backgroundColor: color }]} />
    <View style={[styles.trashBody, { borderColor: color }]} />
  </View>
);

export const ClockIcon = ({ color = MUTED }: { color?: string }) => (
  <View style={[styles.clock, { borderColor: color }]}>
    <View style={[styles.clockHand, { backgroundColor: color }]} />
  </View>
);

export const CheckIcon = ({ color = '#149653' }: { color?: string }) => (
  <View style={[styles.check, { borderColor: color }]} />
);

const styles = StyleSheet.create({
  recycle: { width: 20, height: 20 },
  recycleLight: { tintColor: '#fff' },
  mail: {
    width: 18,
    height: 13,
    borderWidth: 1.6,
    borderColor: MUTED,
    borderRadius: 3,
    overflow: 'hidden',
  },
  mailFlap: {
    position: 'absolute',
    top: -6,
    left: 1,
    width: 14,
    height: 14,
    borderLeftWidth: 1.6,
    borderBottomWidth: 1.6,
    borderColor: MUTED,
    transform: [{ rotate: '-45deg' }],
  },
  lockWrap: { width: 16, height: 18, alignItems: 'center' },
  shackle: {
    width: 10,
    height: 7,
    borderWidth: 1.6,
    borderBottomWidth: 0,
    borderColor: MUTED,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  lockBody: {
    width: 16,
    height: 11,
    borderRadius: 3,
    backgroundColor: MUTED,
  },
  eyeWrap: { width: 20, height: 14, alignItems: 'center', justifyContent: 'center' },
  eyeOuter: {
    width: 18,
    height: 12,
    borderRadius: 9,
    borderWidth: 1.6,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: MUTED,
  },
  eyeSlash: {
    position: 'absolute',
    width: 20,
    height: 1.6,
    backgroundColor: MUTED,
    transform: [{ rotate: '-28deg' }],
  },
  personWrap: { width: 16, height: 18, alignItems: 'center' },
  personHead: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.6,
    borderColor: MUTED,
  },
  personBody: {
    marginTop: 1,
    width: 14,
    height: 8,
    borderWidth: 1.6,
    borderBottomWidth: 0,
    borderColor: MUTED,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: MUTED,
    transform: [{ rotate: '-45deg' }],
    marginRight: 4,
  },
  searchWrap: { width: 16, height: 16 },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: MUTED,
  },
  searchHandle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 6,
    height: 1.6,
    backgroundColor: MUTED,
    transform: [{ rotate: '40deg' }],
  },
  targetOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.6,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetMid: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.4,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: MUTED },
  filterWrap: { height: 14, justifyContent: 'space-between', alignItems: 'center' },
  filterLine: { height: 1.6, backgroundColor: MUTED, borderRadius: 1 },
  leaf: {
    width: 14,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    transform: [{ rotate: '-20deg' }],
    overflow: 'hidden',
  },
  leafVein: {
    position: 'absolute',
    left: 6,
    top: 2,
    width: 1.4,
    height: 14,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
  tabGlyph: { width: 18, height: 14, justifyContent: 'space-between' },
  listBar: { height: 2, width: 18, borderRadius: 1 },
  pin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  pinDot: { width: 4, height: 4, borderRadius: 2 },
  camBody: {
    width: 18,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camLens: { width: 6, height: 6, borderRadius: 3, borderWidth: 1.4 },
  plusWrap: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  plusBar: { position: 'absolute', width: 12, height: 2, borderRadius: 1 },
  plusBarVert: { position: 'absolute', width: 2, height: 12, borderRadius: 1 },
  pencil: {
    width: 12,
    height: 3,
    borderRadius: 1,
    transform: [{ rotate: '-40deg' }],
  },
  trashWrap: { width: 14, height: 16, alignItems: 'center' },
  trashLid: { width: 14, height: 2, borderRadius: 1, marginBottom: 1 },
  trashBody: {
    width: 12,
    height: 11,
    borderWidth: 1.6,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  clock: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  clockHand: { width: 1.6, height: 5, borderRadius: 1 },
  check: {
    width: 6,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginBottom: 3,
  },
});
