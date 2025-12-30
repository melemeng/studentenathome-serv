import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, Trash2, Eye, Shield } from "lucide-react";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set SEO
    import("@/lib/seo").then(({ default: setMeta }) => {
      setMeta({
        title: "Admin Panel | StudentenAtHome",
        description: "Verwaltung von Blog-Beiträgen",
        canonical: "/admin",
      });
    });

    // Check if user is admin
    const checkAuth = () => {
      try {
        const sessionStr = localStorage.getItem("authSession");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          const isValid = Date.now() < session.expiresAt;

          if (!isValid) {
            toast.error("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
            return;
          }

          // Check if user has admin privileges
          if (!session.isAdmin) {
            toast.error(
              "Zugriff verweigert: Sie benötigen Administrator-Rechte."
            );
            setTimeout(() => {
              window.location.href = "/blog";
            }, 2000);
            return;
          }

          setIsAdmin(true);
          fetchPosts(session.token);
        } else {
          toast.error("Keine Berechtigung. Bitte melden Sie sich an.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } catch (e) {
        console.error(e);
        setIsAdmin(false);
        toast.error("Fehler beim Überprüfen der Berechtigung.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchPosts = async (token: string) => {
    try {
      const res = await fetch("/api/posts?all=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        toast.error("Fehler beim Laden der Beiträge");
      }
    } catch (e) {
      console.error(e);
      toast.error("Verbindungsfehler");
    }
  };

  const updatePostStatus = async (
    postId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const sessionStr = localStorage.getItem("authSession");
      if (!sessionStr) {
        toast.error("Keine Berechtigung");
        return;
      }

      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? updatedPost : p))
        );
        toast.success(
          status === "approved"
            ? "Beitrag genehmigt und veröffentlicht!"
            : "Beitrag abgelehnt"
        );
        setSelectedPost(null);
      } else {
        toast.error("Fehler beim Aktualisieren");
      }
    } catch (e) {
      console.error(e);
      toast.error("Verbindungsfehler");
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Möchten Sie diesen Beitrag wirklich löschen?")) {
      return;
    }

    try {
      const sessionStr = localStorage.getItem("authSession");
      if (!sessionStr) {
        toast.error("Keine Berechtigung");
        return;
      }

      const session = JSON.parse(sessionStr);
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success("Beitrag gelöscht");
        setSelectedPost(null);
      } else {
        toast.error("Fehler beim Löschen");
      }
    } catch (e) {
      console.error(e);
      toast.error("Verbindungsfehler");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Genehmigt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Ausstehend
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <Shield className="h-12 w-12 text-accent animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Keine Berechtigung</h2>
            <p className="text-muted-foreground mb-4">
              Sie müssen als Administrator angemeldet sein, um auf diese Seite
              zuzugreifen.
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingPosts = posts.filter((p) => p.status === "pending");
  const approvedPosts = posts.filter((p) => p.status === "approved");
  const rejectedPosts = posts.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-primary flex items-center gap-3">
              <Shield className="h-10 w-10 text-accent" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Verwalten und genehmigen Sie Blog-Beiträge
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {pendingPosts.length}
              </div>
              <div className="text-muted-foreground">Ausstehend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {approvedPosts.length}
              </div>
              <div className="text-muted-foreground">Genehmigt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {rejectedPosts.length}
              </div>
              <div className="text-muted-foreground">Abgelehnt</div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {selectedPost ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {selectedPost.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {getStatusBadge(selectedPost.status)}
                    <span>Von {selectedPost.author}</span>
                    <span>{selectedPost.category}</span>
                    <span>
                      {new Date(selectedPost.submittedAt).toLocaleString(
                        "de-DE"
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                >
                  Schließen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Kurzbeschreibung:</h3>
                  <p className="text-muted-foreground">
                    {selectedPost.excerpt}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Inhalt:</h3>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedPost.content),
                    }}
                  />
                </div>
                <Separator />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => deletePost(selectedPost.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Löschen
                  </Button>
                  {selectedPost.status !== "rejected" && (
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500"
                      onClick={() =>
                        updatePostStatus(selectedPost.id, "rejected")
                      }
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Ablehnen
                    </Button>
                  )}
                  {selectedPost.status !== "approved" && (
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() =>
                        updatePostStatus(selectedPost.id, "approved")
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Genehmigen
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Pending Posts */}
            {pendingPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-yellow-500" />
                  Ausstehende Beiträge ({pendingPosts.length})
                </h2>
                <div className="grid gap-4">
                  {pendingPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-yellow-500/5 border-yellow-500/30"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.excerpt}
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>{post.author}</span>
                              <span>{post.category}</span>
                              <span>
                                {new Date(post.submittedAt).toLocaleString(
                                  "de-DE"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPost(post)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ansehen
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() =>
                                updatePostStatus(post.id, "approved")
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                updatePostStatus(post.id, "rejected")
                              }
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Posts */}
            {approvedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Genehmigte Beiträge ({approvedPosts.length})
                </h2>
                <div className="grid gap-4">
                  {approvedPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-green-500/5 border-green-500/30"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {post.title}
                            </h3>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>{post.author}</span>
                              <span>
                                Veröffentlicht:{" "}
                                {new Date(post.publishedAt!).toLocaleString(
                                  "de-DE"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPost(post)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ansehen
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Posts */}
            {rejectedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-500" />
                  Abgelehnte Beiträge ({rejectedPosts.length})
                </h2>
                <div className="grid gap-4">
                  {rejectedPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-red-500/5 border-red-500/30"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {post.title}
                            </h3>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>{post.author}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPost(post)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ansehen
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {posts.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    Keine Beiträge vorhanden
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
