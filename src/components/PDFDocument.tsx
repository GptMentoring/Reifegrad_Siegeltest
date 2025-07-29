import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PDFDocumentProps {
  answers: Record<string, string>;
  scores: {
    competence: number;
    tools: number;
    structure: number;
    products: number;
    strategy: number;
  };
  widgetConfig: { primaryColor: string };
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scoreOverview: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  overallScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  scoreItem: {
    width: '50%',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  answerSection: {
    marginTop: 20,
  },
  questionGroup: {
    marginBottom: 15,
  },
  questionId: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  answer: {
    fontSize: 12,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

export function PDFDocument({ answers, scores, widgetConfig }: PDFDocumentProps) {
  // Calculate overall score
  const overallScore = Number((Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1));

  // Get maturity level based on score
  const getMaturityLevel = (score: number): string => {
    if (score <= 1.5) return 'Einsteiger';
    if (score <= 2.5) return 'Fortgeschritten';
    if (score <= 3.5) return 'Kompetent';
    if (score <= 4.5) return 'Experte';
    return 'Vorreiter';
  };

  // Format date
  const currentDate = new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>KI-Reifegrad Analyse</Text>
          <Text style={styles.subtitle}>Erstellt am {currentDate}</Text>
        </View>

        {/* Overall Score Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gesamtbewertung</Text>
          <View style={styles.scoreOverview}>
            <Text style={styles.overallScore}>
              Gesamtscore: {overallScore} / 5.0
            </Text>
            <Text style={styles.scoreLabel}>
              Maturitätslevel: {getMaturityLevel(overallScore)}
            </Text>
          </View>
        </View>

        {/* Detailed Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaillierte Bewertung</Text>
          <View style={styles.scoreGrid}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Kompetenz</Text>
              <Text style={styles.scoreValue}>{scores.competence.toFixed(1)} / 5.0</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Tools</Text>
              <Text style={styles.scoreValue}>{scores.tools.toFixed(1)} / 5.0</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Struktur</Text>
              <Text style={styles.scoreValue}>{scores.structure.toFixed(1)} / 5.0</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Produkte</Text>
              <Text style={styles.scoreValue}>{scores.products.toFixed(1)} / 5.0</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Strategie</Text>
              <Text style={styles.scoreValue}>{scores.strategy.toFixed(1)} / 5.0</Text>
            </View>
          </View>
        </View>

        {/* Answers Section */}
        <View style={styles.answerSection}>
          <Text style={styles.sectionTitle}>Ihre Antworten im Detail</Text>
          {Object.entries(answers).map(([key, value]) => (
            <View key={key} style={styles.questionGroup}>
              <Text style={styles.questionId}>Frage {key}</Text>
              <Text style={styles.answer}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © {new Date().getFullYear()} KI-Reifegrad Analyse • Alle Rechte vorbehalten
        </Text>
      </Page>
    </Document>
  );
}