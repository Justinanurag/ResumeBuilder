import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor, fontFamily = "'Roboto', sans-serif" }) => {

    // Normalize URL to always include https://
    const formatURL = (url) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return "https://" + url;
    };

    // Clean URL text for display (remove https:// and www)
    const cleanURL = (url) => {
        if (!url) return "";
        return url
            .replace("https://www.", "")
            .replace("http://www.", "")
            .replace("https://", "")
            .replace("http://", "");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed" style={{ fontFamily }} data-font-family={fontFamily}>

            {/* Header */}
            <header
                className="text-center mb-8 pb-6 border-b-2"
                style={{ borderColor: accentColor }}
            >
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">

                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="size-4" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}

                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}

                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}

                    {/* CLICKABLE LINKEDIN */}
                    {data.personal_info?.linkedin && (
                        <a
                            href={formatURL(data.personal_info.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            <Linkedin className="size-4" />
                            <span className="break-all">{cleanURL(data.personal_info.linkedin)}</span>
                        </a>
                    )}

                    {/* CLICKABLE WEBSITE */}
                    {data.personal_info?.website && (
                        <a
                            href={formatURL(data.personal_info.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline cursor-pointer"
                        >
                            <Globe className="size-4" />
                            <span className="break-all">{cleanURL(data.personal_info.website)}</span>
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div
                                key={index}
                                className="pl-4 border-l-4"
                                style={{ borderColor: accentColor }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>

                                    <div className="text-right text-sm text-gray-600">
                                        {formatDate(exp.start_date)} -{" "}
                                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </div>
                                </div>

                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <ul className="space-y-3">
                        {data.project.map((proj, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-start pl-6 border-l-4"
                                style={{ borderColor: accentColor }}
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && (
                                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                                    )}
                                </div>

                                <div className="text-sm text-gray-600">
                                    {formatDate(edu.graduation_date)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        CORE SKILLS
                    </h2>

                    <div className="flex gap-4 flex-wrap text-gray-700">
                        {data.skills.map((skill, index) => (
                            <span key={index}>• {skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ClassicTemplate;
