import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { certificationsData, personalData } from '../../data/portfolioData';

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Verified Qualifications"
          title="Certifications &"
          highlight="Professional Learning"
          subtitle="Accredited certifications achieved through Springboard & continuous independent study."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full flex flex-col justify-between group hover:border-emerald-500/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      {cert.provider}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {cert.year}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors mb-2">
                    {cert.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono">{cert.category}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Verification CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="glass-panel p-6 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-100">Verify Official Credentials</h4>
                <p className="text-xs text-neutral-400">All certificates are backed by verified Springboard transcripts.</p>
              </div>
            </div>

            <Button
              href={personalData.certificateDriveLink}
              target="_blank"
              variant="primary"
              size="sm"
              icon={ExternalLink}
              iconPosition="right"
              className="shrink-0"
            >
              Open GDrive Folder
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
