"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/http";
import { IdeasApi } from "@/lib/api/ideas";
import type { Idea } from "@/types/ideas";
import "./admin-ideas.scss";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function formatMediumDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function parseError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401 || err.status === 403) {
      return "You must be signed in as admin to use Ideas.";
    }
    if (err.status === 0) return "Could not reach the server.";
    const detail = (err.error as { detail?: string } | null)?.detail;
    return typeof detail === "string" ? detail : "Something went wrong. Try again.";
  }
  return "Something went wrong. Try again.";
}

export function AdminIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setLoadingList(true);
    setLoadError(null);
    IdeasApi.list()
      .then((res) => {
        setIdeas(res.results);
        setLoadingList(false);
      })
      .catch((err) => {
        setLoadingList(false);
        setLoadError(parseError(err));
      });
  }, []);

  const startNewIdea = () => {
    setSelectedId(null);
    setTitle("");
    setBody("");
    setSaveStatus("idle");
    setLoadError(null);
  };

  const editIdea = (idea: Idea) => {
    setSelectedId(idea.id);
    setTitle(idea.title);
    setBody(idea.body);
    setSaveStatus("idle");
    setLoadError(null);
  };

  const deleteIdea = (idea: Idea, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm(`Delete "${idea.title || "Untitled idea"}"?`)) return;

    IdeasApi.remove(idea.id)
      .then(() => {
        setIdeas((list) => list.filter((i) => i.id !== idea.id));
        if (selectedId === idea.id) {
          startNewIdea();
        }
      })
      .catch((err) => setLoadError(parseError(err)));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;

    const id = selectedId;

    setSaving(true);
    setSaveStatus("saving");
    setLoadError(null);

    const request = id
      ? IdeasApi.update(id, { title, body })
      : IdeasApi.create({ title, body });

    request
      .then((idea) => {
        setSaving(false);
        setSaveStatus("saved");
        setSelectedId(idea.id);
        setIdeas((list) => {
          const without = list.filter((i) => i.id !== idea.id);
          return [idea, ...without];
        });
      })
      .catch((err) => {
        setSaving(false);
        setSaveStatus("error");
        setLoadError(parseError(err));
      });
  };

  const saveStatusLabel = (): string => {
    switch (saveStatus) {
      case "saving":
        return "Saving…";
      case "saved":
        return selectedId ? "Changes saved." : "Saved to your ideas list.";
      case "error":
        return "Save failed";
      default:
        return "";
    }
  };

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>Ideas</h1>
          <p>Write on the right, then save. Saved ideas appear on the left.</p>
        </div>
        <button type="button" className="wo-btn wo-btn--ghost" onClick={startNewIdea}>
          New idea
        </button>
      </header>

      {loadError && <p className="wo-error page__error">{loadError}</p>}

      <div className="ideas-split">
        <aside className="ideas-saved" aria-label="Saved ideas">
          <h2 className="ideas-saved__heading">Saved ideas</h2>

          {loadingList && <div className="state">Loading…</div>}

          {!loadingList && !ideas.length && (
            <p className="state ideas-saved__empty">
              No ideas saved yet. Write a title and your note on the right, then press{" "}
              <strong>Save</strong>.
            </p>
          )}

          {!loadingList && ideas.length > 0 && (
            <ul className="ideas-saved__list">
              {ideas.map((idea) => (
                <li
                  key={idea.id}
                  className={`idea-card${selectedId === idea.id ? " idea-card--active" : ""}`}
                >
                  <div className="idea-card__head">
                    <h3 className="idea-card__title">{idea.title || "Untitled idea"}</h3>
                    <time className="idea-card__date">{formatMediumDate(idea.updated_at)}</time>
                  </div>

                  <div className="idea-card__actions">
                    <button
                      type="button"
                      className="idea-card__btn"
                      onClick={() => editIdea(idea)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="idea-card__btn idea-card__btn--danger"
                      onClick={(e) => deleteIdea(idea, e)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="ideas-compose" aria-label="Write idea">
          <h2 className="ideas-compose__heading">{selectedId ? "Edit idea" : "Write idea"}</h2>

          <form className="ideas-compose__form" onSubmit={save}>
            <div className="field">
              <label className="wo-label" htmlFor="idea-title">
                Title
              </label>
              <input
                id="idea-title"
                type="text"
                className="wo-input ideas-compose__title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Idea title"
              />
            </div>

            <div className="field field--grow">
              <label className="wo-label" htmlFor="idea-body">
                Your note
              </label>
              <textarea
                id="idea-body"
                className="wo-textarea ideas-compose__body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                placeholder="Write your idea here…"
              ></textarea>
            </div>

            <div className="ideas-compose__footer">
              {saveStatus !== "idle" && (
                <p
                  className={`save-hint${saveStatus === "saved" ? " save-hint--ok" : ""}${
                    saveStatus === "error" ? " save-hint--error" : ""
                  }`}
                >
                  {saveStatusLabel()}
                </p>
              )}

              <button type="submit" className="wo-btn wo-btn--primary" disabled={saving}>
                {saving ? "Saving…" : selectedId ? "Save changes" : "Save"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
