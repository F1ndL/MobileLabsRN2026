import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const ROOT_LABEL = "Документи";

const initialForm = {
  folderName: "",
  fileName: "",
  fileContent: ""
};

export default function App() {
  const rootUri = FileSystem.documentDirectory;
  const [currentUri, setCurrentUri] = useState(rootUri);
  const [pathSegments, setPathSegments] = useState([]);
  const [items, setItems] = useState([]);
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [createFolderVisible, setCreateFolderVisible] = useState(false);
  const [createFileVisible, setCreateFileVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editorText, setEditorText] = useState("");

  const breadcrumb = useMemo(() => {
    return [ROOT_LABEL, ...pathSegments].join(" / ");
  }, [pathSegments]);

  const loadStorage = useCallback(async () => {
    try {
      const [total, free] = await Promise.all([
        FileSystem.getTotalDiskCapacityAsync(),
        FileSystem.getFreeDiskStorageAsync()
      ]);
      setStorage({
        total,
        free,
        used: Math.max(total - free, 0)
      });
    } catch (storageError) {
      setStorage(null);
    }
  }, []);

  const loadDirectory = useCallback(
    async (uri, shouldRefresh = false) => {
      const targetUri = uri ?? rootUri;

      if (!targetUri) {
        setError("Не вдалося знайти директорію застосунку.");
        setLoading(false);
        return;
      }

      shouldRefresh ? setRefreshing(true) : setLoading(true);
      setError("");

      try {
        const names = await FileSystem.readDirectoryAsync(targetUri);
        const entries = await Promise.all(
          names.map(async (name) => {
            const itemUri = joinUri(targetUri, name);
            const info = await FileSystem.getInfoAsync(itemUri);
            const isDirectory = Boolean(info.isDirectory);

            return {
              name,
              uri: isDirectory ? ensureTrailingSlash(itemUri) : itemUri,
              isDirectory,
              size: info.size ?? 0,
              modificationTime: info.modificationTime ?? null,
              type: isDirectory ? "Папка" : getFileType(name)
            };
          })
        );

        entries.sort((a, b) => {
          if (a.isDirectory !== b.isDirectory) {
            return a.isDirectory ? -1 : 1;
          }
          return a.name.localeCompare(b.name, "uk");
        });

        setItems(entries);
        await loadStorage();
      } catch (directoryError) {
        setError("Не вдалося прочитати поточну директорію.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadStorage, rootUri]
  );

  useEffect(() => {
    loadDirectory(rootUri);
  }, [loadDirectory, rootUri]);

  const openDirectory = (item) => {
    setPathSegments((segments) => [...segments, item.name]);
    setCurrentUri(item.uri);
    loadDirectory(item.uri);
  };

  const goUp = () => {
    if (pathSegments.length === 0) {
      return;
    }

    const nextSegments = pathSegments.slice(0, -1);
    const nextUri = nextSegments.reduce(
      (uri, segment) => ensureTrailingSlash(joinUri(uri, segment)),
      rootUri
    );

    setPathSegments(nextSegments);
    setCurrentUri(nextUri);
    loadDirectory(nextUri);
  };

  const createFolder = async () => {
    const name = sanitizeName(form.folderName);
    if (!name) {
      Alert.alert("Назва потрібна", "Введіть назву папки.");
      return;
    }

    const targetUri = ensureTrailingSlash(joinUri(currentUri, name));
    const existing = await FileSystem.getInfoAsync(targetUri);
    if (existing.exists) {
      Alert.alert("Об'єкт існує", "Файл або папка з такою назвою вже є.");
      return;
    }

    try {
      await FileSystem.makeDirectoryAsync(targetUri, { intermediates: false });
      closeCreateModals();
      await loadDirectory(currentUri, true);
    } catch (createError) {
      Alert.alert("Помилка", "Не вдалося створити папку.");
    }
  };

  const createFile = async () => {
    const name = withTxtExtension(sanitizeName(form.fileName));
    if (!name) {
      Alert.alert("Назва потрібна", "Введіть назву текстового файлу.");
      return;
    }

    const targetUri = joinUri(currentUri, name);
    const existing = await FileSystem.getInfoAsync(targetUri);
    if (existing.exists) {
      Alert.alert("Об'єкт існує", "Файл або папка з такою назвою вже є.");
      return;
    }

    try {
      await FileSystem.writeAsStringAsync(targetUri, form.fileContent);
      closeCreateModals();
      await loadDirectory(currentUri, true);
    } catch (createError) {
      Alert.alert("Помилка", "Не вдалося створити файл.");
    }
  };

  const openFile = async (item) => {
    if (getFileType(item.name) !== "TXT") {
      Alert.alert("Перегляд недоступний", "Редагування реалізовано для файлів .txt.");
      return;
    }

    try {
      const content = await FileSystem.readAsStringAsync(item.uri);
      setSelectedItem(item);
      setEditorText(content);
      setEditorVisible(true);
    } catch (readError) {
      Alert.alert("Помилка", "Не вдалося прочитати файл.");
    }
  };

  const saveFile = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      await FileSystem.writeAsStringAsync(selectedItem.uri, editorText);
      setEditorVisible(false);
      setSelectedItem(null);
      setEditorText("");
      await loadDirectory(currentUri, true);
    } catch (writeError) {
      Alert.alert("Помилка", "Не вдалося зберегти зміни.");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Підтвердьте видалення",
      `Видалити "${item.name}"${item.isDirectory ? " разом із вмістом" : ""}?`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => deleteItem(item)
        }
      ]
    );
  };

  const deleteItem = async (item) => {
    try {
      await FileSystem.deleteAsync(item.uri, { idempotent: true });
      await loadDirectory(currentUri, true);
    } catch (deleteError) {
      Alert.alert("Помилка", "Не вдалося видалити об'єкт.");
    }
  };

  const showInfo = (item) => {
    setSelectedItem(item);
    setInfoVisible(true);
  };

  const closeCreateModals = () => {
    setCreateFolderVisible(false);
    setCreateFileVisible(false);
    setForm(initialForm);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Pressable
        accessibilityRole="button"
        style={styles.itemMain}
        onPress={() => (item.isDirectory ? openDirectory(item) : openFile(item))}
      >
        <View style={[styles.fileBadge, item.isDirectory && styles.folderBadge]}>
          <Text style={styles.fileBadgeText}>{item.isDirectory ? "DIR" : item.type}</Text>
        </View>
        <View style={styles.itemTextBlock}>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.name}
          </Text>
          <Text style={styles.itemMeta}>
            {item.isDirectory ? "Папка" : formatBytes(item.size)} · {formatDate(item.modificationTime)}
          </Text>
        </View>
      </Pressable>

      <View style={styles.itemActions}>
        <Pressable style={styles.iconButton} onPress={() => showInfo(item)}>
          <Text style={styles.iconButtonText}>i</Text>
        </Pressable>
        <Pressable style={[styles.iconButton, styles.deleteButton]} onPress={() => confirmDelete(item)}>
          <Text style={[styles.iconButtonText, styles.deleteButtonText]}>X</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Файловий менеджер</Text>
          <Text numberOfLines={2} style={styles.breadcrumb}>
            {breadcrumb}
          </Text>
        </View>

        <View style={styles.storagePanel}>
          <StorageCell label="Загалом" value={storage ? formatBytes(storage.total) : "..."} />
          <StorageCell label="Вільно" value={storage ? formatBytes(storage.free) : "..."} />
          <StorageCell label="Зайнято" value={storage ? formatBytes(storage.used) : "..."} />
        </View>

        <View style={styles.toolbar}>
          <Pressable
            style={[styles.toolbarButton, pathSegments.length === 0 && styles.disabledButton]}
            disabled={pathSegments.length === 0}
            onPress={goUp}
          >
            <Text style={styles.toolbarButtonText}>Вгору</Text>
          </Pressable>
          <Pressable style={styles.toolbarButton} onPress={() => setCreateFolderVisible(true)}>
            <Text style={styles.toolbarButtonText}>Папка</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => setCreateFileVisible(true)}>
            <Text style={styles.primaryButtonText}>TXT файл</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="large" color="#0f766e" />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.uri}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => loadDirectory(currentUri, true)}
            contentContainerStyle={items.length === 0 ? styles.emptyList : styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>Ця папка порожня</Text>}
          />
        )}
      </View>

      <FormModal
        visible={createFolderVisible}
        title="Нова папка"
        onClose={closeCreateModals}
        onSubmit={createFolder}
        submitLabel="Створити"
      >
        <TextInput
          placeholder="Назва папки"
          value={form.folderName}
          onChangeText={(folderName) => setForm((value) => ({ ...value, folderName }))}
          style={styles.input}
          autoCapitalize="none"
        />
      </FormModal>

      <FormModal
        visible={createFileVisible}
        title="Новий TXT файл"
        onClose={closeCreateModals}
        onSubmit={createFile}
        submitLabel="Створити"
      >
        <TextInput
          placeholder="Назва файлу"
          value={form.fileName}
          onChangeText={(fileName) => setForm((value) => ({ ...value, fileName }))}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Початковий вміст"
          value={form.fileContent}
          onChangeText={(fileContent) => setForm((value) => ({ ...value, fileContent }))}
          style={[styles.input, styles.multilineInput]}
          multiline
          textAlignVertical="top"
        />
      </FormModal>

      <Modal visible={editorVisible} animationType="slide" onRequestClose={() => setEditorVisible(false)}>
        <SafeAreaView style={styles.modalFullScreen}>
          <KeyboardAvoidingView
            style={styles.modalFullScreen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalHeader}>
              <Text numberOfLines={1} style={styles.modalTitle}>
                {selectedItem?.name}
              </Text>
              <Pressable onPress={() => setEditorVisible(false)}>
                <Text style={styles.closeText}>Закрити</Text>
              </Pressable>
            </View>
            <TextInput
              value={editorText}
              onChangeText={setEditorText}
              style={styles.editor}
              multiline
              textAlignVertical="top"
            />
            <Pressable style={styles.saveButton} onPress={saveFile}>
              <Text style={styles.saveButtonText}>Зберегти зміни</Text>
            </Pressable>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <FormModal
        visible={infoVisible}
        title="Інформація"
        onClose={() => setInfoVisible(false)}
        onSubmit={() => setInfoVisible(false)}
        submitLabel="Готово"
      >
        <InfoLine label="Назва" value={selectedItem?.name ?? "-"} />
        <InfoLine label="Тип" value={selectedItem?.type ?? "-"} />
        <InfoLine label="Розмір" value={selectedItem?.isDirectory ? "Папка" : formatBytes(selectedItem?.size ?? 0)} />
        <InfoLine label="Змінено" value={formatDate(selectedItem?.modificationTime)} />
        <InfoLine label="URI" value={selectedItem?.uri ?? "-"} />
      </FormModal>
    </SafeAreaView>
  );
}

function StorageCell({ label, value }) {
  return (
    <View style={styles.storageCell}>
      <Text style={styles.storageLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.storageValue}>
        {value}
      </Text>
    </View>
  );
}

function FormModal({ visible, title, children, onClose, onSubmit, submitLabel }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>
          {children}
          <View style={styles.modalActions}>
            <Pressable style={styles.secondaryAction} onPress={onClose}>
              <Text style={styles.secondaryActionText}>Скасувати</Text>
            </Pressable>
            <Pressable style={styles.primaryAction} onPress={onSubmit}>
              <Text style={styles.primaryActionText}>{submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function InfoLine({ label, value }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text selectable style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function joinUri(baseUri, name) {
  return `${baseUri.endsWith("/") ? baseUri : `${baseUri}/`}${name}`;
}

function ensureTrailingSlash(uri) {
  return uri.endsWith("/") ? uri : `${uri}/`;
}

function sanitizeName(value) {
  return value.trim().replace(/[\\/]/g, "_");
}

function withTxtExtension(name) {
  if (!name) {
    return "";
  }
  return name.toLowerCase().endsWith(".txt") ? name : `${name}.txt`;
}

function getFileType(name) {
  const extension = name.includes(".") ? name.split(".").pop() : "";
  return extension ? extension.toUpperCase() : "FILE";
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value) {
  if (!value) {
    return "Немає даних";
  }

  const timestamp = value < 10000000000 ? value * 1000 : value;
  return new Date(timestamp).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7faf8"
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 18 : 6
  },
  header: {
    paddingBottom: 14
  },
  title: {
    color: "#10201d",
    fontSize: 28,
    fontWeight: "800"
  },
  breadcrumb: {
    color: "#52615e",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20
  },
  storagePanel: {
    backgroundColor: "#ffffff",
    borderColor: "#dce7e3",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12
  },
  storageCell: {
    flex: 1,
    minHeight: 70,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: "center"
  },
  storageLabel: {
    color: "#66736f",
    fontSize: 12,
    marginBottom: 6
  },
  storageValue: {
    color: "#112925",
    fontSize: 16,
    fontWeight: "800"
  },
  toolbar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  toolbarButton: {
    alignItems: "center",
    backgroundColor: "#e7f1ee",
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  toolbarButtonText: {
    color: "#16423c",
    fontSize: 15,
    fontWeight: "700"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800"
  },
  disabledButton: {
    opacity: 0.45
  },
  errorText: {
    color: "#b42318",
    marginBottom: 10
  },
  loadingBlock: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  listContent: {
    paddingBottom: 24
  },
  emptyList: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  emptyText: {
    color: "#6d7775",
    fontSize: 16
  },
  itemRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dce7e3",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    minHeight: 72,
    paddingHorizontal: 10
  },
  itemMain: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    minWidth: 0
  },
  fileBadge: {
    alignItems: "center",
    backgroundColor: "#eef2f7",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    marginRight: 10,
    width: 48
  },
  folderBadge: {
    backgroundColor: "#dcfce7"
  },
  fileBadgeText: {
    color: "#1f3b35",
    fontSize: 12,
    fontWeight: "900"
  },
  itemTextBlock: {
    flex: 1,
    minWidth: 0
  },
  itemName: {
    color: "#182522",
    fontSize: 16,
    fontWeight: "700"
  },
  itemMeta: {
    color: "#697571",
    fontSize: 12,
    marginTop: 4
  },
  itemActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#edf5f2",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  iconButtonText: {
    color: "#16423c",
    fontSize: 15,
    fontWeight: "900"
  },
  deleteButton: {
    backgroundColor: "#fee4e2"
  },
  deleteButtonText: {
    color: "#b42318"
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(16, 32, 29, 0.42)",
    flex: 1,
    justifyContent: "center",
    padding: 18
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxWidth: 520,
    padding: 18,
    width: "100%"
  },
  modalTitle: {
    color: "#10201d",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14
  },
  input: {
    backgroundColor: "#f8fbfa",
    borderColor: "#ccd9d5",
    borderRadius: 8,
    borderWidth: 1,
    color: "#10201d",
    fontSize: 16,
    minHeight: 48,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  multilineInput: {
    minHeight: 140
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 4
  },
  secondaryAction: {
    alignItems: "center",
    borderColor: "#cdd8d5",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  secondaryActionText: {
    color: "#40514c",
    fontSize: 15,
    fontWeight: "700"
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800"
  },
  modalFullScreen: {
    backgroundColor: "#f7faf8",
    flex: 1
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#dce7e3",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 58,
    paddingHorizontal: 16
  },
  closeText: {
    color: "#0f766e",
    fontSize: 15,
    fontWeight: "800"
  },
  editor: {
    backgroundColor: "#ffffff",
    borderColor: "#dce7e3",
    borderRadius: 8,
    borderWidth: 1,
    color: "#10201d",
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    margin: 16,
    padding: 14
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    minHeight: 50
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  infoLine: {
    borderBottomColor: "#edf2f0",
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  infoLabel: {
    color: "#66736f",
    fontSize: 12,
    marginBottom: 4
  },
  infoValue: {
    color: "#10201d",
    fontSize: 15,
    lineHeight: 21
  }
});
