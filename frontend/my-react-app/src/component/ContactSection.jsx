export default function ContactSection({
  contactForm,
  onFormChange,
  onSubmit,
  loading,
  error,
  success,
}) {
  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-4">
          Need Support or Municipal Partnership?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Are you a city official, ward representative, or active community volunteer? Reach out to collaborate with FixNear.
        </p>

        <div className="bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-2xl text-left max-w-xl mx-auto shadow-xs">
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              {error && (
                <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </p>
              )}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Jane Doe"
                  value={contactForm.name}
                  onChange={(event) => onFormChange({ ...contactForm, name: event.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  maxLength={254}
                  placeholder="jane@example.com"
                  value={contactForm.email}
                  onChange={(event) => onFormChange({ ...contactForm, email: event.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows="3"
                  id="contact-message"
                  name="message"
                  required
                  maxLength={5000}
                  placeholder="How can FixNear help your ward or neighborhood?"
                  value={contactForm.message}
                  onChange={(event) => onFormChange({ ...contactForm, message: event.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

