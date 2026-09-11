import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Compass,
  Layers,
  ShieldCheck,
  Navigation,
  ExternalLink,
  Cpu,
  Activity,
  Waves,
  Sparkles
} from 'lucide-react-native';

// Production Cloud Deployment Endpoints
const BACKEND_HEALTH_URL = 'https://mausamsetu-backend.onrender.com/api/health';
const FRONTEND_PLATFORM_URL = 'https://mausamsetu.vercel.app';

export default function App() {
  const [serverOnline, setServerOnline] = useState(false);
  const [checkingServer, setCheckingServer] = useState(true);

  useEffect(() => {
    // Check production backend health on launch
    fetch(BACKEND_HEALTH_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status === 'healthy') {
          setServerOnline(true);
        }
      })
      .catch((err) => {
        console.warn('Backend health check error:', err);
        setServerOnline(false);
      })
      .finally(() => {
        setCheckingServer(false);
      });
  }, []);

  const openPlatform = async () => {
    try {
      await WebBrowser.openBrowserAsync(FRONTEND_PLATFORM_URL);
    } catch (error) {
      console.warn('Cannot open WebBrowser', error);
    }
  };

  const capabilities = [
    {
      title: 'Village-Centric Geocoding',
      tag: 'OSM Nominatim + Open-Meteo',
      desc: 'Multi-stage entity extraction resolving remote gram panchayats, river basins, and coastal taluks with Romanized coordinate alignment.',
      icon: Compass,
      accent: '#06b6d4',
    },
    {
      title: '3D DEM Inundation Simulation',
      tag: 'Terrain Elevation Modeling',
      desc: 'Simulates progressive flood surge levels from 0.0m to 6.0m, evaluating culvert saturation thresholds and highway submergence.',
      icon: Layers,
      accent: '#3b82f6',
    },
    {
      title: 'Clearance-Aware Evac Corridors',
      tag: 'Ground Clearance vs Choke Points',
      desc: 'Dynamically routes walking citizens (15cm), two-wheelers (12cm), sedans (22cm), and rescue trucks (80cm) around flooded waypoints to elevated shelters.',
      icon: Navigation,
      accent: '#10b981',
    },
    {
      title: 'Quorum Anti-Spoofing Triangulation',
      tag: '500m Haversine Consensus',
      desc: 'Prevents fraudulent citizen hazard claims by requiring spatial consensus triangulation within 0.5 km before escalating emergency alert levels.',
      icon: ShieldCheck,
      accent: '#f59e0b',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* AtmosIQ Team Branding Badge */}
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={['rgba(6, 182, 212, 0.25)', 'rgba(59, 130, 246, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.teamBadge}
          >
            <Cpu size={14} color="#06b6d4" />
            <Text style={styles.teamBadgeText}>TEAM ATMOSIQ</Text>
            <View style={styles.dividerDot} />
            <Text style={styles.sihText}>MOES SIH 2026</Text>
          </LinearGradient>
        </View>

        {/* Platform Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Waves size={32} color="#06b6d4" style={{ marginRight: 10 }} />
            <Text style={styles.title}>MausamSetu</Text>
          </View>
          <Text style={styles.subtitle}>
            Autonomous Meteorological Agent & Tactical GIS Command Deck
          </Text>
          <Text style={styles.ministryText}>
            Ministry of Earth Sciences (MoES) • Government of India
          </Text>
        </View>

        {/* Server Status Indicator */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Activity size={16} color={serverOnline ? '#10b981' : '#f59e0b'} />
              <Text style={styles.statusLabel}>FastAPI Telemetry Core:</Text>
            </View>
            <View style={styles.statusRight}>
              {checkingServer ? (
                <ActivityIndicator size="small" color="#06b6d4" />
              ) : (
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: serverOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' },
                  ]}
                >
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: serverOnline ? '#10b981' : '#f59e0b' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: serverOnline ? '#10b981' : '#f59e0b' },
                    ]}
                  >
                    {serverOnline ? 'ONLINE (Cloud Node)' : 'STANDBY'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Button: Launch MausamSetu Platform */}
        <TouchableOpacity
          style={styles.launchButtonContainer}
          activeOpacity={0.85}
          onPress={openPlatform}
        >
          <LinearGradient
            colors={['#06b6d4', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.launchButton}
          >
            <Sparkles size={20} color="#090d16" style={{ marginRight: 8 }} />
            <Text style={styles.launchButtonText}>Launch MausamSetu Platform</Text>
            <ExternalLink size={18} color="#090d16" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Capabilities Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TACTICAL ARCHITECTURE CAPABILITIES</Text>
          <Text style={styles.sectionSubtitle}>
            Autonomous multi-hazard mitigation & high-resolution spatial decision stack
          </Text>
        </View>

        {capabilities.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: `${item.accent}1A`, borderColor: `${item.accent}4D` },
                  ]}
                >
                  <IconComponent size={20} color={item.accent} />
                </View>
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={[styles.cardTag, { color: item.accent }]}>{item.tag}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Team AtmosIQ • Ministry of Earth Sciences Platform v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  teamBadgeText: {
    color: '#06b6d4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 6,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748b',
    marginHorizontal: 8,
  },
  sihText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#38bdf8',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  ministryText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#0d1322',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 18,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  statusRight: {},
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  launchButtonContainer: {
    marginBottom: 24,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  launchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  launchButtonText: {
    color: '#090d16',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 11,
  },
  card: {
    backgroundColor: '#0d1322',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
});