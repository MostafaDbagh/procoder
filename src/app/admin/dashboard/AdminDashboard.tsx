"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminFetch,
  clearAdminToken,
  getAdminToken,
} from "@/lib/admin-api";

type Tab =
  | "overview"
  | "courses"
  | "enrollments"
  | "contacts"
  | "challenges"
  | "team";

type Overview = {
  users: { total: number; byRole: Record<string, number> };
  enrollments: {
    total: number;
    byStatus: Record<string, number>;
    byCourseId: { courseId: string; count: number }[];
  };
  contacts: { total: number; new: number };
  courses: { active: number; total: number };
  team: { active: number; total: number };
  challenges: {
    records: number;
    published: number;
    emailSignups: number;
  };
};

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "enrollments", label: "Enrollments" },
  { id: "contacts", label: "Contact" },
  { id: "challenges", label: "Challenges" },
  { id: "team", label: "Team" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [err, setErr] = useState("");

  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [courseFilter, setCourseFilter] = useState({ active: "", category: "" });

  const [enrollments, setEnrollments] = useState<Record<string, unknown>[]>([]);
  const [enrFilter, setEnrFilter] = useState({
    status: "",
    courseId: "",
    q: "",
  });

  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
  const [conFilter, setConFilter] = useState({
    status: "",
    q: "",
    challengeOnly: false,
  });

  const [challenges, setChallenges] = useState<Record<string, unknown>[]>([]);
  const [chFilter, setChFilter] = useState({ q: "", published: "" });

  const [team, setTeam] = useState<Record<string, unknown>[]>([]);
  const [teamFilter, setTeamFilter] = useState({ active: "" });

  const [courseModal, setCourseModal] = useState<{
    mode: "create" | "edit";
    slug?: string;
  } | null>(null);
  const [challengeModal, setChallengeModal] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [teamModal, setTeamModal] = useState<Record<string, unknown> | null>(
    null
  );

  const guard = useCallback(() => {
    if (!getAdminToken()) router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    guard();
  }, [guard]);

  const loadOverview = useCallback(async () => {
    const data = await adminFetch<Overview>("/admin/overview");
    setOverview(data);
  }, []);

  const loadCourses = useCallback(async () => {
    const q = new URLSearchParams();
    if (courseFilter.active === "true" || courseFilter.active === "false")
      q.set("active", courseFilter.active);
    if (courseFilter.category) q.set("category", courseFilter.category);
    const data = await adminFetch<Record<string, unknown>[]>(
      `/courses/admin/list?${q}`
    );
    setCourses(data);
  }, [courseFilter]);

  const loadEnrollments = useCallback(async () => {
    const q = new URLSearchParams();
    if (enrFilter.status) q.set("status", enrFilter.status);
    if (enrFilter.courseId) q.set("courseId", enrFilter.courseId);
    if (enrFilter.q) q.set("q", enrFilter.q);
    const data = await adminFetch<Record<string, unknown>[]>(
      `/enrollments?${q}`
    );
    setEnrollments(data);
  }, [enrFilter]);

  const loadContacts = useCallback(async () => {
    const q = new URLSearchParams();
    if (conFilter.status) q.set("status", conFilter.status);
    if (conFilter.q) q.set("q", conFilter.q);
    if (conFilter.challengeOnly) q.set("challengeOnly", "true");
    const data = await adminFetch<Record<string, unknown>[]>(
      `/contact?${q}`
    );
    setContacts(data);
  }, [conFilter]);

  const loadChallenges = useCallback(async () => {
    const q = new URLSearchParams();
    if (chFilter.q) q.set("q", chFilter.q);
    if (chFilter.published === "true" || chFilter.published === "false")
      q.set("published", chFilter.published);
    const data = await adminFetch<Record<string, unknown>[]>(
      `/challenges?${q}`
    );
    setChallenges(data);
  }, [chFilter]);

  const loadTeam = useCallback(async () => {
    const q = new URLSearchParams();
    if (teamFilter.active === "true" || teamFilter.active === "false")
      q.set("active", teamFilter.active);
    const data = await adminFetch<Record<string, unknown>[]>(
      `/team/admin/list?${q}`
    );
    setTeam(data);
  }, [teamFilter]);

  useEffect(() => {
    if (!getAdminToken()) return;
    let cancelled = false;
    (async () => {
      try {
        if (tab === "overview") await loadOverview();
        if (tab === "courses") await loadCourses();
        if (tab === "enrollments") await loadEnrollments();
        if (tab === "contacts") await loadContacts();
        if (tab === "challenges") await loadChallenges();
        if (tab === "team") await loadTeam();
        if (!cancelled) setErr("");
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Failed to load");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    tab,
    loadOverview,
    loadCourses,
    loadEnrollments,
    loadContacts,
    loadChallenges,
    loadTeam,
  ]);

  const logout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  const patchEnrollmentStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/enrollments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadEnrollments();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  };

  const patchContactStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadContacts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  };

  const deactivateCourse = async (slug: string) => {
    if (!confirm(`Deactivate course "${slug}"?`)) return;
    try {
      await adminFetch(`/courses/${slug}`, { method: "DELETE" });
      await loadCourses();
      await loadOverview();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  };

  const deleteChallenge = async (id: string) => {
    if (!confirm("Delete this challenge permanently?")) return;
    try {
      await adminFetch(`/challenges/${id}`, { method: "DELETE" });
      await loadChallenges();
      await loadOverview();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  };

  const deactivateTeam = async (id: string) => {
    if (!confirm("Deactivate team member?")) return;
    try {
      await adminFetch(`/team/${id}`, { method: "DELETE" });
      await loadTeam();
      await loadOverview();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-52 shrink-0 border-r border-slate-800 bg-slate-900/50 p-4 md:block">
        <div className="mb-8 font-semibold text-white">Admin</div>
        <nav className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                tab === t.id
                  ? "bg-primary/20 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-8 w-full rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:hidden">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as Tab)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
          >
            {TABS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-slate-400"
          >
            Log out
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {err ? (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300">
              {err}
            </div>
          ) : null}

          {tab === "overview" && overview && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Users" value={overview.users.total} />
              <StatCard
                title="Enrollments"
                value={overview.enrollments.total}
              />
              <StatCard title="Contacts" value={overview.contacts.total} />
              <StatCard
                title="New messages"
                value={overview.contacts.new}
                hint="status: new"
              />
              <StatCard
                title="Courses (active / total)"
                value={`${overview.courses.active} / ${overview.courses.total}`}
              />
              <StatCard
                title="Team (active / total)"
                value={`${overview.team.active} / ${overview.team.total}`}
              />
              <StatCard
                title="Challenge records"
                value={overview.challenges.records}
              />
              <StatCard
                title="Challenge email signups"
                value={overview.challenges.emailSignups}
                hint="Contact subject filter"
              />
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
                <h3 className="mb-2 text-sm font-medium text-slate-300">
                  Users by role
                </h3>
                <pre className="overflow-x-auto text-xs text-slate-400">
                  {JSON.stringify(overview.users.byRole, null, 2)}
                </pre>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
                <h3 className="mb-2 text-sm font-medium text-slate-300">
                  Enrollments by status
                </h3>
                <pre className="overflow-x-auto text-xs text-slate-400">
                  {JSON.stringify(overview.enrollments.byStatus, null, 2)}
                </pre>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
                <h3 className="mb-2 text-sm font-medium text-slate-300">
                  Enrollments by courseId
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="py-1">Course</th>
                      <th className="py-1">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.enrollments.byCourseId.map((r) => (
                      <tr key={String(r.courseId)} className="text-slate-300">
                        <td className="py-1">{String(r.courseId)}</td>
                        <td className="py-1">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "courses" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <FilterSelect
                  label="Active"
                  value={courseFilter.active}
                  onChange={(v) =>
                    setCourseFilter((f) => ({ ...f, active: v }))
                  }
                  options={[
                    { value: "", label: "All" },
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ]}
                />
                <input
                  placeholder="category filter"
                  value={courseFilter.category}
                  onChange={(e) =>
                    setCourseFilter((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setCourseModal({ mode: "create" })}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Add course
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2">Slug</th>
                      <th className="p-2">Title (en)</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Active</th>
                      <th className="p-2">Enrolled*</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr
                        key={String(c.slug)}
                        className="border-t border-slate-800/80"
                      >
                        <td className="p-2 font-mono text-xs">{String(c.slug)}</td>
                        <td className="p-2">
                          {String((c.title as { en?: string })?.en ?? "")}
                        </td>
                        <td className="p-2">{String(c.category)}</td>
                        <td className="p-2">{String(c.isActive)}</td>
                        <td className="p-2">{String(c.enrollmentCount ?? 0)}</td>
                        <td className="p-2 space-x-2">
                          <button
                            type="button"
                            className="text-primary text-xs"
                            onClick={() =>
                              setCourseModal({
                                mode: "edit",
                                slug: String(c.slug),
                              })
                            }
                          >
                            Edit
                          </button>
                          {c.isActive ? (
                            <button
                              type="button"
                              className="text-red-400 text-xs"
                              onClick={() =>
                                deactivateCourse(String(c.slug))
                              }
                            >
                              Deactivate
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500">
                * enrollmentCount is maintained on the Course document when new
                enrollments are submitted.
              </p>
            </div>
          )}

          {tab === "enrollments" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <input
                  placeholder="status"
                  value={enrFilter.status}
                  onChange={(e) =>
                    setEnrFilter((f) => ({ ...f, status: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <input
                  placeholder="courseId"
                  value={enrFilter.courseId}
                  onChange={(e) =>
                    setEnrFilter((f) => ({ ...f, courseId: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <input
                  placeholder="search email / name"
                  value={enrFilter.q}
                  onChange={(e) =>
                    setEnrFilter((f) => ({ ...f, q: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Parent</th>
                      <th className="p-2">Child</th>
                      <th className="p-2">Course</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((r) => (
                      <tr
                        key={String(r._id)}
                        className="border-t border-slate-800/80"
                      >
                        <td className="p-2 text-xs text-slate-400">
                          {String(r.createdAt ?? "").slice(0, 10)}
                        </td>
                        <td className="p-2">{String(r.parentName)}</td>
                        <td className="p-2">{String(r.childName)}</td>
                        <td className="p-2 font-mono text-xs">
                          {String(r.courseId)}
                        </td>
                        <td className="p-2">
                          <select
                            value={String(r.status)}
                            onChange={(e) =>
                              patchEnrollmentStatus(
                                String(r._id),
                                e.target.value
                              )
                            }
                            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                          >
                            {[
                              "pending",
                              "confirmed",
                              "active",
                              "completed",
                              "cancelled",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "contacts" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  placeholder="status (new/read/replied)"
                  value={conFilter.status}
                  onChange={(e) =>
                    setConFilter((f) => ({ ...f, status: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <input
                  placeholder="search"
                  value={conFilter.q}
                  onChange={(e) =>
                    setConFilter((f) => ({ ...f, q: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={conFilter.challengeOnly}
                    onChange={(e) =>
                      setConFilter((f) => ({
                        ...f,
                        challengeOnly: e.target.checked,
                      }))
                    }
                  />
                  Challenge signups only
                </label>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Subject</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((r) => (
                      <tr
                        key={String(r._id)}
                        className="border-t border-slate-800/80 align-top"
                      >
                        <td className="p-2 text-xs text-slate-400">
                          {String(r.createdAt ?? "").slice(0, 10)}
                        </td>
                        <td className="p-2">{String(r.name)}</td>
                        <td className="p-2 text-xs">{String(r.email)}</td>
                        <td className="p-2 max-w-xs truncate text-xs">
                          {String(r.subject)}
                        </td>
                        <td className="p-2">
                          <select
                            value={String(r.status ?? "new")}
                            onChange={(e) =>
                              patchContactStatus(
                                String(r._id),
                                e.target.value
                              )
                            }
                            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                          >
                            {["new", "read", "replied"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "challenges" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <input
                  placeholder="search"
                  value={chFilter.q}
                  onChange={(e) =>
                    setChFilter((f) => ({ ...f, q: e.target.value }))
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
                <FilterSelect
                  label="Published"
                  value={chFilter.published}
                  onChange={(v) =>
                    setChFilter((f) => ({ ...f, published: v }))
                  }
                  options={[
                    { value: "", label: "All" },
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                />
                <button
                  type="button"
                  onClick={() => setChallengeModal({})}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                  Add challenge
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2">Slug</th>
                      <th className="p-2">Month</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Published</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((r) => (
                      <tr
                        key={String(r._id)}
                        className="border-t border-slate-800/80"
                      >
                        <td className="p-2 font-mono text-xs">
                          {String(r.slug)}
                        </td>
                        <td className="p-2">{String(r.monthKey)}</td>
                        <td className="p-2">{String(r.titleEn)}</td>
                        <td className="p-2">{String(r.isPublished)}</td>
                        <td className="p-2 space-x-2">
                          <button
                            type="button"
                            className="text-primary text-xs"
                            onClick={() => setChallengeModal({ ...r })}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-400 text-xs"
                            onClick={() => deleteChallenge(String(r._id))}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "team" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <FilterSelect
                  label="Active"
                  value={teamFilter.active}
                  onChange={(v) =>
                    setTeamFilter((f) => ({ ...f, active: v }))
                  }
                  options={[
                    { value: "", label: "All" },
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                  ]}
                />
                <button
                  type="button"
                  onClick={() => setTeamModal({})}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                  Add member
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2">Name (en)</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Avatar</th>
                      <th className="p-2">Active</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((r) => (
                      <tr
                        key={String(r._id)}
                        className="border-t border-slate-800/80"
                      >
                        <td className="p-2">
                          {String((r.name as { en?: string })?.en)}
                        </td>
                        <td className="p-2 text-xs">
                          {String((r.role as { en?: string })?.en)}
                        </td>
                        <td className="p-2">{String(r.avatar)}</td>
                        <td className="p-2">{String(r.isActive)}</td>
                        <td className="p-2 space-x-2">
                          <button
                            type="button"
                            className="text-primary text-xs"
                            onClick={() => setTeamModal({ ...r })}
                          >
                            Edit
                          </button>
                          {r.isActive ? (
                            <button
                              type="button"
                              className="text-red-400 text-xs"
                              onClick={() =>
                                deactivateTeam(String(r._id))
                              }
                            >
                              Deactivate
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {courseModal && (
        <CourseFormModal
          mode={courseModal.mode}
          slug={courseModal.slug}
          onClose={() => setCourseModal(null)}
          onSaved={async () => {
            setCourseModal(null);
            await loadCourses();
            await loadOverview();
          }}
        />
      )}

      {challengeModal !== null && (
        <ChallengeFormModal
          initial={challengeModal}
          onClose={() => setChallengeModal(null)}
          onSaved={async () => {
            setChallengeModal(null);
            await loadChallenges();
            await loadOverview();
          }}
        />
      )}

      {teamModal !== null && (
        <TeamFormModal
          initial={teamModal}
          onClose={() => setTeamModal(null)}
          onSaved={async () => {
            setTeamModal(null);
            await loadTeam();
            await loadOverview();
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-slate-600">{hint}</div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
      >
        {options.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CourseFormModal({
  mode,
  slug,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  slug?: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(mode === "edit");
  const [form, setForm] = useState({
    slug: "",
    category: "programming",
    ageMin: 8,
    ageMax: 12,
    level: "beginner",
    lessons: 10,
    durationWeeks: 8,
    iconName: "BookOpen",
    color: "from-blue-400 to-cyan-400",
    titleEn: "",
    titleAr: "",
    descEn: "",
    descAr: "",
    skillsEn: "",
    skillsAr: "",
    price: 0,
    currency: "USD",
  });

  useEffect(() => {
    if (mode !== "edit" || !slug) return;
    (async () => {
      try {
        const c = await adminFetch<Record<string, unknown>>(
          `/courses/admin/by-slug/${slug}`
        );
        const title = c.title as { en: string; ar: string };
        const desc = c.description as { en: string; ar: string };
        const skills = c.skills as { en: string[]; ar: string[] };
        setForm({
          slug: String(c.slug),
          category: String(c.category),
          ageMin: Number(c.ageMin),
          ageMax: Number(c.ageMax),
          level: String(c.level),
          lessons: Number(c.lessons),
          durationWeeks: Number(c.durationWeeks),
          iconName: String(c.iconName ?? "BookOpen"),
          color: String(c.color ?? "from-blue-400 to-cyan-400"),
          titleEn: title?.en ?? "",
          titleAr: title?.ar ?? "",
          descEn: desc?.en ?? "",
          descAr: desc?.ar ?? "",
          skillsEn: (skills?.en ?? []).join(", "),
          skillsAr: (skills?.ar ?? []).join(", "),
          price: Number(c.price ?? 0),
          currency: String(c.currency ?? "USD"),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, slug]);

  const save = async () => {
    const body = {
      slug: form.slug,
      category: form.category,
      ageMin: form.ageMin,
      ageMax: form.ageMax,
      level: form.level,
      lessons: form.lessons,
      durationWeeks: form.durationWeeks,
      iconName: form.iconName,
      color: form.color,
      title: { en: form.titleEn, ar: form.titleAr },
      description: { en: form.descEn, ar: form.descAr },
      skills: {
        en: form.skillsEn.split(",").map((s) => s.trim()).filter(Boolean),
        ar: form.skillsAr.split(",").map((s) => s.trim()).filter(Boolean),
      },
      price: form.price,
      currency: form.currency,
    };
    if (mode === "create") {
      await adminFetch("/courses", { method: "POST", body: JSON.stringify(body) });
    } else {
      await adminFetch(`/courses/${slug}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    }
    await onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          {mode === "create" ? "New course" : "Edit course"}
        </h2>
        {loading ? (
          <p className="mt-4 text-slate-400">Loading…</p>
        ) : (
          <div className="mt-4 grid gap-3 text-sm">
            <input
              placeholder="slug"
              disabled={mode === "edit"}
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-60"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={form.ageMin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ageMin: +e.target.value }))
                }
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
              />
              <input
                type="number"
                value={form.ageMax}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ageMax: +e.target.value }))
                }
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
              />
            </div>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            >
              {[
                "programming",
                "robotics",
                "algorithms",
                "arabic",
                "quran",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(e) =>
                setForm((f) => ({ ...f, level: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            >
              {["beginner", "intermediate", "advanced"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="title EN"
              value={form.titleEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, titleEn: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            />
            <input
              placeholder="title AR"
              value={form.titleAr}
              onChange={(e) =>
                setForm((f) => ({ ...f, titleAr: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            />
            <textarea
              placeholder="description EN"
              value={form.descEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, descEn: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
              rows={3}
            />
            <textarea
              placeholder="description AR"
              value={form.descAr}
              onChange={(e) =>
                setForm((f) => ({ ...f, descAr: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
              rows={3}
            />
            <input
              placeholder="skills EN comma"
              value={form.skillsEn}
              onChange={(e) =>
                setForm((f) => ({ ...f, skillsEn: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            />
            <input
              placeholder="skills AR comma"
              value={form.skillsAr}
              onChange={(e) =>
                setForm((f) => ({ ...f, skillsAr: e.target.value }))
              }
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
            />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => save().catch(console.error)}
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Record<string, unknown>;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const isNew = !initial._id;
  const [form, setForm] = useState({
    slug: String(initial.slug ?? ""),
    monthKey: String(initial.monthKey ?? ""),
    badgeEn: String(initial.badgeEn ?? ""),
    badgeAr: String(initial.badgeAr ?? ""),
    titleEn: String(initial.titleEn ?? ""),
    titleAr: String(initial.titleAr ?? ""),
    subtitleEn: String(initial.subtitleEn ?? ""),
    subtitleAr: String(initial.subtitleAr ?? ""),
    hintBodyEn: String(initial.hintBodyEn ?? ""),
    hintBodyAr: String(initial.hintBodyAr ?? ""),
    isPublished: Boolean(initial.isPublished),
    stepsJson: JSON.stringify(initial.steps ?? [], null, 2),
  });

  const save = async () => {
    let steps: unknown[] = [];
    try {
      steps = JSON.parse(form.stepsJson) as unknown[];
    } catch {
      alert("Steps must be valid JSON array");
      return;
    }
    const body = {
      slug: form.slug,
      monthKey: form.monthKey,
      badgeEn: form.badgeEn,
      badgeAr: form.badgeAr,
      titleEn: form.titleEn,
      titleAr: form.titleAr,
      subtitleEn: form.subtitleEn,
      subtitleAr: form.subtitleAr,
      hintBodyEn: form.hintBodyEn,
      hintBodyAr: form.hintBodyAr,
      isPublished: form.isPublished,
      steps,
    };
    if (isNew) {
      await adminFetch("/challenges", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } else {
      await adminFetch(`/challenges/${String(initial._id)}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    }
    await onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          {isNew ? "New challenge" : "Edit challenge"}
        </h2>
        <div className="mt-4 grid gap-2 text-sm">
          <input
            placeholder="slug"
            value={form.slug}
            disabled={!isNew}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="monthKey YYYY-MM"
            value={form.monthKey}
            onChange={(e) =>
              setForm((f) => ({ ...f, monthKey: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="title EN"
            value={form.titleEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleEn: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="title AR"
            value={form.titleAr}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleAr: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <label className="flex items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPublished: e.target.checked }))
              }
            />
            Published
          </label>
          <textarea
            value={form.stepsJson}
            onChange={(e) =>
              setForm((f) => ({ ...f, stepsJson: e.target.value }))
            }
            className="font-mono text-xs rounded border border-slate-700 bg-slate-950 px-2 py-1"
            rows={8}
            placeholder='[{"titleEn":"","titleAr":"","bodyEn":"","bodyAr":""}]'
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => save().catch(console.error)}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Record<string, unknown>;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const isNew = !initial._id;
  const name = initial.name as { en?: string; ar?: string } | undefined;
  const role = initial.role as { en?: string; ar?: string } | undefined;
  const [form, setForm] = useState({
    nameEn: String(name?.en ?? ""),
    nameAr: String(name?.ar ?? ""),
    roleEn: String(role?.en ?? ""),
    roleAr: String(role?.ar ?? ""),
    avatar: String(initial.avatar ?? "PC"),
    color: String(initial.color ?? "from-blue-400 to-cyan-400"),
    order: Number(initial.order ?? 0),
    linkedin: String(initial.linkedin ?? ""),
  });

  const save = async () => {
    const body = {
      name: { en: form.nameEn, ar: form.nameAr },
      role: { en: form.roleEn, ar: form.roleAr },
      avatar: form.avatar.slice(0, 2),
      color: form.color,
      order: form.order,
      linkedin: form.linkedin,
    };
    if (isNew) {
      await adminFetch("/team", { method: "POST", body: JSON.stringify(body) });
    } else {
      await adminFetch(`/team/${String(initial._id)}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    }
    await onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          {isNew ? "New team member" : "Edit team member"}
        </h2>
        <div className="mt-4 grid gap-2 text-sm">
          <input
            placeholder="Name EN"
            value={form.nameEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, nameEn: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="Name AR"
            value={form.nameAr}
            onChange={(e) =>
              setForm((f) => ({ ...f, nameAr: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="Role EN"
            value={form.roleEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, roleEn: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="Role AR"
            value={form.roleAr}
            onChange={(e) =>
              setForm((f) => ({ ...f, roleAr: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
          <input
            placeholder="Avatar1-2 chars"
            value={form.avatar}
            maxLength={2}
            onChange={(e) =>
              setForm((f) => ({ ...f, avatar: e.target.value }))
            }
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => save().catch(console.error)}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
