# Middle School Non-Academic Skills Measurement Engine

**Organization:** Flourish Schools  
**Project ID:** JnGyV0Xlx2AEiL31nu7J_1761530509243

## Product Requirements Document (PRD)

---

## 1. Executive Summary

The Middle School Non-Academic Skills Measurement Engine is an AI-driven solution that provides educators with evidence-based insights into students' non-academic skills development, such as empathy, collaboration, and adaptability. By analyzing classroom conversation transcripts, the system extracts specific behavioral evidence and tracks skill progression over time, enabling teachers to provide targeted, concrete feedback to students.

Unlike traditional assessment tools that reduce complex human development to numbers, this system prioritizes qualitative evidence while providing optional quantitative metrics for administrative reporting. The goal is to enhance teacher insight and student growth, not to replace teacher judgment with scores.

---

## 2. Problem Statement

Middle school educators lack scalable tools to effectively observe and track students' non-academic skills development. Traditional methods rely on sporadic, subjective teacher observations without concrete evidence. This makes it difficult to:

- Provide specific, actionable feedback to students
- Track skill development over time
- Identify patterns across multiple class discussions
- Have evidence-based conversations with parents and administrators

Teachers need a tool that amplifies their observational capacity and provides concrete examples of student behavior, not one that reduces complex skills to arbitrary numbers.

---

## 3. Goals & Success Metrics

**Primary Goal:** Provide evidence-based insights that teachers find accurate and actionable.

**Success Metrics:**
- Teachers agree the evidence reflects their observations (>70% accuracy)
- Teachers can identify at least one insight they hadn't noticed
- Teachers can point to specific evidence in coaching conversations with students
- Observable patterns of skill development emerge across multiple transcripts (4-12 week periods)

---

## 4. Target Users & Personas

**Primary User: Middle School Educators**
- Need concrete evidence to support their observations
- Want to provide specific, behavioral feedback to students
- Limited time for assessment and documentation
- Value tools that enhance (not replace) their professional judgment

**Secondary User: School Administrators**
- Need data for reporting and program evaluation
- Want evidence of educational outcomes
- Require compliance with educational standards
- Value aggregate insights over individual scores

**Tertiary User: Middle School Students**
- Need specific, actionable feedback on soft skills
- Benefit from seeing their own growth over time
- Respond better to concrete examples than abstract scores

---

## 5. User Stories

**As a middle school educator:**
- I want to see specific examples of student behavior so that I can reference them in coaching conversations
- I want to identify patterns I might have missed during live discussion so that I can support all students effectively
- I want to track how students develop over time so that I can celebrate growth and adjust my instruction

**As a school administrator:**
- I want aggregate evidence of skill development across cohorts so that I can report outcomes to stakeholders
- I want exportable metrics for compliance reporting while maintaining instructional focus on qualitative growth

**As a student:**
- I want to see specific moments where I demonstrated skills well so that I can understand what growth looks like
- I want concrete feedback I can act on rather than abstract scores

---

## 6. Functional Requirements

### P0: Must-have (Critical for Demo)

**Core Analysis:**
- The system must extract specific behavioral evidence of non-academic skills from classroom conversation transcripts
- The system must identify which student demonstrated which behavior with supporting quotes
- The system must provide reasoning for each observation
- The system must track 5 core skills based on Flourish Schools/CASEL framework:
  - Empathy & Perspective-Taking
  - Collaboration & Relationship Skills
  - Adaptability & Open-Mindedness
  - Active Listening & Focus
  - Participation & Engagement
- The system must assess overall session quality (engagement level, discussion flow, key moments)

**Evidence Presentation:**
- The system must display student-specific evidence panels showing concrete examples
- The system must show actual transcript excerpts (not just summaries)
- The system must organize evidence by skill category
- The system must show temporal patterns (evidence accumulation over time)

**Quantitative Support:**
- The system must generate quantitative scores (1-5 scale) for administrative reporting
- Scores must include confidence levels (high/medium/low based on evidence availability)
- Low confidence scores are a feature (indicate students need more opportunities to demonstrate skills)
- Scores must be clearly secondary to evidence in the UI
- Scores must be contextualized with the behavioral evidence that supports them

### P1: Should-have (Important but not for initial demo)

**Enhanced Analysis:**
- The system should analyze multiple transcript types (discussions, project work, peer feedback)
- The system should identify skill emergence (new behaviors appearing for the first time)
- The system should detect class-wide patterns and trends

**Dashboard Features:**
- The system should provide a class overview with all students
- The system should enable filtering by skill or growth trajectory
- The system should offer export functionality for administrative reporting

### P2: Nice-to-have (Future iterations)

**Scaling:**
- The system could support high-performance parallel processing of multiple transcripts
- The system could handle full days of classroom conversations
- The system could integrate with existing school management systems

**Advanced Features:**
- The system could provide predictive analytics for skill development trajectories
- The system could offer customizable reporting tools for various stakeholders

---

## 7. Non-Functional Requirements

**Performance (Demo scope):**
- Single transcript analysis should complete within 30-60 seconds
- Frontend should feel responsive and polished
- Initial demo can use pre-processed results

**Security:**
- Must use environment variables for API keys (never expose in frontend)
- Must handle student data with appropriate privacy considerations
- Future: FERPA compliance required for production deployment

**Usability:**
- Interface must be intuitive for educators with varying technical proficiency
- Evidence must be scannable and easy to understand
- Key insights should be visible without excessive clicking

**Scalability (Future):**
- Architecture should allow for adding parallel processing later
- Data model should support longitudinal tracking
- Design should accommodate multiple schools/districts eventually

---

## 8. User Experience & Design Principles

### Core UX Philosophy

**Evidence-First Design:**
- Lead with qualitative observations and concrete examples
- Make behavioral evidence the hero of the interface
- Use scores only for secondary/administrative purposes

**Teacher Empowerment:**
- Enhance teacher judgment, don't replace it
- Make it easier for teachers to be engaged, not easier to be lazy
- Reward teacher attention and thoughtfulness

**Actionable Feedback:**
- Show what students actually said/did
- Enable teachers to reference specific moments
- Focus on growth and development, not rankings

### Key User Flows

**Primary Flow: Reviewing Student Evidence**
1. Teacher views class overview
2. Clicks on a student card
3. Sees evidence organized by skill
4. Reads actual transcript excerpts
5. Notes specific examples for coaching conversations

**Secondary Flow: Tracking Growth Over Time**
1. Teacher selects a student
2. Views timeline of observations
3. Sees evidence density increase
4. Identifies emergence of new behaviors
5. Prepares growth narrative for parent conferences

**Administrative Flow: Generating Reports**
1. Administrator accesses export view
2. Reviews aggregate metrics
3. Exports quantitative data for compliance
4. Evidence remains available for deeper inquiry

### Design Considerations

- Use color-coding for quick visual scanning (green/yellow/red indicators)
- Highlight actual student quotes to build trust and transparency
- Show growth through visual patterns, not just number changes
- Make evidence expandable/collapsible for dense information
- Consider accessibility standards (contrast, screen readers, keyboard navigation)

---

## 9. Technical Requirements

### Architecture (Demo Scope)

**Frontend:**
- Language: JavaScript/TypeScript
- Framework: React
- Deployment: Vercel/Netlify (static site for demo)
- Data: Pre-processed JSON files with analysis results

**Analysis Engine:**
- AI Provider: OpenAI API (GPT-4 or similar)
- Approach: Carefully engineered prompts for evidence extraction with structured JSON output
- Processing: Pre-processed for Weeks 10-19, live API call for Week 20 demo
- Analysis stages: Evidence extraction → Confidence assessment → Session analysis → Teacher recommendations

**Data Storage (Demo):**
- Format: JSON files containing transcripts and analysis results
- Structure: Student profiles, skill assessments, evidence arrays
- Future: PostgreSQL for production longitudinal tracking

### Data Requirements

**Input Format:**
- Classroom conversation transcripts (text format)
- Speaker labels (Student A, Student B, Teacher, etc.)
- Metadata: Date, class period, discussion type

**Output Format:**
```json
{
  "student_id": "Student A",
  "transcripts_analyzed": ["transcript_1", "transcript_2"],
  "skills": {
    "empathy": {
      "evidence": [
        {
          "quote": "I see what you're saying...",
          "context": "Response to peer disagreement",
          "behavior": "Perspective-taking",
          "timestamp": "Discussion 1, 12:34"
        }
      ],
      "pattern": "Increasingly consistent",
      "score": 4.2,
      "score_justification": "Based on frequency and sophistication"
    }
  },
  "growth_narrative": "Student A shows strong development..."
}
```

### APIs & Tools

- **Anthropic Claude API:** Primary analysis engine
- **React libraries:** React Router, data visualization (Recharts/Recharts alternatives)
- **UI components:** Tailwind CSS for styling
- **Future:** Transcription APIs (Whisper, AssemblyAI) when handling audio

---

## 10. Implementation Phases

### Phase 1: Proof of Concept Demo (Current Focus)

**Deliverables:**
- 6 realistic book club discussion transcripts (8th grade, 5 students, ~15 min each)
  - Weeks 10, 12, 15, 17, 19 (pre-loaded)
  - Week 20 (added live during demo)
- Analysis prompts (OpenAI) that extract quality evidence with confidence levels
- React dashboard showing evidence-first UI
- Pre-processed results for Weeks 10-19, live processing for Week 20
- Session-level analysis (engagement quality, key moments, concerns)

**Timeline:** 2 weeks (bootcamp timeline)

**Demo Scenario:**
- Mid-year teacher (Week 20) reviews class dashboard
- Uploads today's transcript → live analysis with OpenAI
- Immediate insights popup shows highlights, concerns, and teacher action recommendations
- Dashboard updates with new evidence and longitudinal patterns

**Success Criteria:**
- Teachers say "yes, that's accurate" to the evidence
- Demo shows clear student growth over time (especially Jordan, Alex)
- Low confidence scores effectively flag students needing more opportunities
- Session analysis provides actionable insights
- Core value proposition is validated

### Phase 2: Live Processing (Post-Demo)

**Deliverables:**
- Backend API for transcript analysis
- Real-time processing capability
- Progress indicators during analysis
- Ability to upload and analyze new transcripts

**Success Criteria:**
- Can process transcript in under 60 seconds
- Results quality matches pre-processed demo
- Teachers willing to upload their own transcripts

### Phase 3: Scale & Production (Future)

**Deliverables:**
- Parallel processing infrastructure
- Database for longitudinal tracking
- Multi-school/multi-district support
- Full administrative reporting suite

**Success Criteria:**
- Can handle full day of transcripts (6+ discussions)
- Reliable tracking across semester/year
- School administrators find reporting valuable

---

## 11. Dependencies & Assumptions

**Dependencies:**
- Access to OpenAI API (GPT-4 or similar)
- Claude CLI for generating realistic synthetic book club transcripts
- React development environment
- Vercel/Netlify deployment platform

**Assumptions:**
- AI can meaningfully assess soft skills from text transcripts (will validate in Week 1 with sample transcript)
- Teachers will find evidence-based approach more valuable than scores-first approach
- Quality of analysis depends heavily on prompt engineering
- Confidence levels (high/medium/low) provide meaningful signal about evidence quality
- Book club discussions provide sufficient evidence for skill assessment
- 5 students per discussion is sufficient to show varied personas and patterns
- Schools will eventually need/want this capability (market validation needed)

**Future Dependencies:**
- Partnership with schools for real transcript testing
- Transcription service if handling audio
- Compliance review for educational data handling

---

## 12. Out of Scope

**For Initial Demo:**
- Real-time/live processing of transcripts
- High-performance parallel processing infrastructure
- Integration with school management systems
- Audio recording and transcription pipeline
- Multi-user authentication and access control
- Production-grade security and compliance
- Predictive analytics or advanced reporting

**For All Versions:**
- Integration with non-educational platforms
- Assessment of academic performance (grades, test scores)
- Automated intervention recommendations without teacher review
- Student-facing scoring or ranking systems

---

## 13. Risks & Mitigations

**Risk: AI analysis quality doesn't match teacher observations**
- Mitigation: Extensive prompt engineering and testing with educators
- Validation: Multiple rounds of teacher feedback on sample analyses

**Risk: Teachers use scores inappropriately despite design intent**
- Mitigation: Clear UI design that de-emphasizes scores
- Education: Documentation and training on evidence-first approach

**Risk: Privacy concerns with student conversation data**
- Mitigation: Clear data handling policies, synthetic data for demo
- Future: FERPA compliance review, parental consent workflows

**Risk: System reinforces biases in language or participation patterns**
- Mitigation: Careful prompt design, acknowledgment of limitations
- Future: Bias testing with diverse student populations

**Risk: Transcription quality issues in real classrooms**
- Mitigation: Out of scope for initial demo, address in Phase 2
- Future: Partner with schools that already record discussions

---

## 14. Success Criteria & Validation

**Demo Success:**
- Teachers view demo and say evidence is accurate and useful
- At least one "aha moment" per teacher (insight they hadn't noticed)
- Teachers express interest in testing with their own classes
- Technical execution is smooth and professional

**Product Success (Future):**
- Teachers use the tool regularly (weekly or more)
- Teachers reference specific evidence in student conversations
- Students show measurable skill development over time
- Schools renew/expand usage after pilot period

**Business Success (Future):**
- Schools willing to pay for the service
- Product differentiates from traditional SEL assessment tools
- Positive educator testimonials and case studies
- Sustainable unit economics at scale

---

## 15. Open Questions

**For Research/Validation:**
- How accurate is AI assessment of soft skills compared to expert human raters?
- What transcript length/quality is needed for reliable assessment?
- Which skills are most/least amenable to transcript-based assessment?
- How do different discussion formats affect analysis quality?

**For Product Design:**
- Should students ever see their own evidence/scores?
- How do we handle students with limited verbal participation?
- What's the right balance of automation vs. teacher interpretation?
- How do we prevent misuse while enabling legitimate use cases?

**For Go-to-Market:**
- What's the right pricing model (per-student, per-school, per-transcript)?
- Who is the actual buyer (teachers, principals, district admin)?
- What's the sales cycle for EdTech in this category?
- How do we demonstrate ROI to schools?

---

## Appendix A: Skill Definitions (Flourish Schools / CASEL Framework)

**1. Empathy & Perspective-Taking**
- Perspective-taking: Acknowledging and paraphrasing others' viewpoints
- Validation: Affirming peers' contributions and feelings
- Emotional responsiveness: Noticing and responding to emotional cues
- Example behaviors: "I see what you mean," paraphrasing before disagreeing, validating feelings

**2. Collaboration & Relationship Skills**
- Building on ideas: Extending or connecting to others' contributions
- Inquiry: Asking clarifying or deepening questions
- Inclusion: Inviting quieter students into discussion
- Example behaviors: "Building on what [name] said...", asking clarifying questions, synthesizing viewpoints

**3. Adaptability & Open-Mindedness**
- Openness: Revising opinions based on new information
- Flexibility: Adjusting approach when circumstances change
- Growth mindset: Viewing challenges as learning opportunities
- Example behaviors: "I hadn't thought of it that way," acknowledging limits of understanding, exploring contradictions

**4. Active Listening & Focus** (Flourish Schools emphasis on mindfulness/focus)
- Attention: Not interrupting, staying engaged
- Reference: Building on specific points others made
- On-task behavior: Staying focused on discussion topic
- Example behaviors: Waiting turn to speak, referencing what others said, minimal interruptions

**5. Participation & Engagement**
- Turn frequency: How often student contributes
- Contribution depth: Brief, substantive, or extended responses
- Initiative: Starting new threads vs. only responding
- Scoring: 1-5 scale based on turn count and depth

---

## Appendix B: Sample Evidence Format

```
Student A - Empathy Development

Week 1 (Sept 15):
• "I hadn't thought about it that way" [Openness to perspective]
• Asked clarifying question after peer disagreed [Engagement]

Week 4 (Oct 6):
• "That's a really interesting point, Marcus. Can you say more?" 
  [Validation + Inquiry]
• Paraphrased Sarah's argument before responding [Perspective-taking]

Week 8 (Nov 3):
• "I think Jamie might be feeling frustrated because..." 
  [Emotional awareness - NEW behavior]
• Mediated disagreement between two peers [Advanced application]

Pattern: Strong growth trajectory. Initially cognitive empathy, 
now developing emotional responsiveness.
```

---

This PRD is designed to align stakeholders and enable independent implementation during the bootcamp timeline, with clear guidance on what to build now versus later. It prioritizes validating the core concept over building production infrastructure.