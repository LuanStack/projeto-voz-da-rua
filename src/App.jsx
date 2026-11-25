import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AboutPilotView } from './components/AboutPilotView';
import { AdminPanel } from './components/AdminPanel';
import { BelemMap } from './components/BelemMap';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { IndicatorsBar } from './components/IndicatorsBar';
import { OccurrenceDetailModal } from './components/OccurrenceDetailModal';
import { OccurrenceFormModal } from './components/OccurrenceFormModal';
import { OccurrenceList } from './components/OccurrenceList';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import {
  generateOccurrenceId,
  loadOccurrences,
  loadSelectedCity,
  loadUserActions,
  resetDemoData,
  saveOccurrences,
  saveSelectedCity,
  saveUserActions,
} from './utils/storage';

const INITIAL_FILTERS = {
  category: 'all',
  neighborhood: 'all',
  status: 'all',
  includeArchived: false,
};

export function App() {
  const [occurrences, setOccurrences] = useState(() => loadOccurrences());
  const [userActions, setUserActions] = useState(() => loadUserActions());
  const [selectedCity, setSelectedCity] = useState(() => loadSelectedCity());

  const [activeTab, setActiveTab] = useState('map');
  const [mobileView, setMobileView] = useState('map');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState(null);
  const [focusedOccurrenceId, setFocusedOccurrenceId] = useState(null);
  const [resetCenterTrigger, setResetCenterTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    saveOccurrences(occurrences);
  }, [occurrences]);

  useEffect(() => {
    saveUserActions(userActions);
  }, [userActions]);

  useEffect(() => {
    saveSelectedCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const filteredOccurrences = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return occurrences.filter((item) => {
      if (!filters.includeArchived && item.status === 'arquivada' && filters.status !== 'arquivada') {
        return false;
      }
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.neighborhood !== 'all' && item.neighborhood !== filters.neighborhood) return false;
      if (filters.status !== 'all' && item.status !== filters.status) return false;

      if (!query) return true;
      return (
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.neighborhood.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query)
      );
    });
  }, [occurrences, filters, searchQuery]);

  const selectedOccurrence = useMemo(
    () => occurrences.find((item) => item.id === selectedOccurrenceId) || null,
    [occurrences, selectedOccurrenceId]
  );

  const focusedOccurrence = useMemo(
    () => occurrences.find((item) => item.id === focusedOccurrenceId) || null,
    [occurrences, focusedOccurrenceId]
  );

  const moderationCount = useMemo(
    () => occurrences.filter((item) => item.status === 'em_moderacao' || item.flags > 0).length,
    [occurrences]
  );

  const handleChangeFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
  };

  const handleCreateOccurrence = (formData) => {
    const now = new Date().toISOString();
    const newId = generateOccurrenceId(occurrences);
    const newRecord = {
      id: newId,
      title: formData.title,
      category: formData.category,
      neighborhood: formData.neighborhood,
      address: formData.address,
      description: formData.description,
      lat: formData.lat,
      lng: formData.lng,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: now,
      updatedAt: now,
      authorName: formData.authorName,
      photoDataUrl: formData.photoDataUrl,
      confirmations: { stillExists: 1, changed: 0, resolved: 0 },
      flags: 0,
      isDemo: false,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: now,
          type: 'criacao',
          actor: formData.authorName,
          message: 'Ocorrência registrada localmente pelo colaborador.',
        },
      ],
    };

    setOccurrences((prev) => [newRecord, ...prev]);
    setIsFormOpen(false);
    setActiveTab('map');
    setMobileView('map');
    setFocusedOccurrenceId(newRecord.id);
    setSelectedOccurrenceId(newRecord.id);
    showToast(`Ocorrência ${newId} registrada e salva no LocalStorage!`);
  };

  const handleConfirmAction = (occurrenceId, actionType, noteText) => {
    const now = new Date().toISOString();

    setOccurrences((prev) =>
      prev.map((item) => {
        if (item.id !== occurrenceId) return item;

        const nextConfirmations = { ...item.confirmations };
        let nextStatus = item.status;
        let nextModeration = item.moderationState;
        let nextFlags = item.flags || 0;
        let message = '';

        if (actionType === 'stillExists') {
          nextConfirmations.stillExists += 1;
          if (item.status === 'em_observacao') {
            nextStatus = 'ativa';
          }
          message = noteText
            ? `Confirmou que continua existindo: "${noteText}"`
            : 'Confirmou que o problema continua existindo.';
        } else if (actionType === 'changed') {
          nextConfirmations.changed += 1;
          if (item.status !== 'arquivada') {
            nextStatus = 'em_observacao';
          }
          message = noteText
            ? `Sinalizou mudança na via: "${noteText}"`
            : 'Sinalizou que a ocorrência mudou ou piorou (marcada como Em observação).';
        } else if (actionType === 'resolved') {
          nextConfirmations.resolved += 1;
          if (nextConfirmations.resolved >= 2) {
            nextStatus = 'resolvida_comunidade';
            message = noteText
              ? `Confirmou resolução (${noteText}) — relato marcado como Resolvida pela comunidade.`
              : 'Confirmou que o problema foi resolvido — status atualizado para Resolvida (comunidade).';
          } else {
            message = noteText
              ? `Registrou 1ª confirmação de resolução: "${noteText}" (aguardando mais 1 confirmação).`
              : 'Registrou confirmação de resolução (mais 1 confirmação comunitária conclui o relato).';
          }
        } else if (actionType === 'flag') {
          nextFlags += 1;
          if (nextFlags >= 1) {
            nextStatus = 'em_moderacao';
            nextModeration = 'pendente';
          }
          message = noteText
            ? `Sinalizou registro para moderação: "${noteText}"`
            : 'Sinalizou possível duplicidade ou inconsistência (enviado ao Painel Admin).';
        }

        return {
          ...item,
          status: nextStatus,
          moderationState: nextModeration,
          flags: nextFlags,
          updatedAt: now,
          confirmations: nextConfirmations,
          history: [
            {
              id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              timestamp: now,
              type: actionType,
              actor: 'Você (Sessão Local)',
              message,
            },
            ...(item.history || []),
          ],
        };
      })
    );

    setUserActions((prev) => ({
      ...prev,
      [occurrenceId]: {
        ...(prev[occurrenceId] || {}),
        [actionType === 'flag' ? 'flagged' : actionType]: true,
      },
    }));
  };

  const handleChangeStatus = (occurrenceId, newStatus) => {
    const now = new Date().toISOString();
    setOccurrences((prev) =>
      prev.map((item) => {
        if (item.id !== occurrenceId || item.status === newStatus) return item;
        return {
          ...item,
          status: newStatus,
          moderationState: newStatus === 'em_moderacao' ? 'pendente' : 'aprovada',
          updatedAt: now,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: now,
              type: 'moderacao',
              actor: 'Moderação (Demo)',
              message: `Situação alterada no painel administrativo para "${newStatus}".`,
            },
            ...(item.history || []),
          ],
        };
      })
    );
    showToast(`Situação de ${occurrenceId} atualizada.`);
  };

  const handleApproveModeration = (occurrenceId) => {
    const now = new Date().toISOString();
    setOccurrences((prev) =>
      prev.map((item) => {
        if (item.id !== occurrenceId) return item;
        return {
          ...item,
          status: 'ativa',
          moderationState: 'aprovada',
          flags: 0,
          updatedAt: now,
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp: now,
              type: 'moderacao',
              actor: 'Moderação (Demo)',
              message: 'Relato aprovado e sinalizações limpas no painel administrativo.',
            },
            ...(item.history || []),
          ],
        };
      })
    );
    showToast(`Relato ${occurrenceId} aprovado e publicado como Ativo.`);
  };

  const handleDeleteOccurrence = (occurrenceId) => {
    setOccurrences((prev) => prev.filter((item) => item.id !== occurrenceId));
    if (selectedOccurrenceId === occurrenceId) setSelectedOccurrenceId(null);
    if (focusedOccurrenceId === occurrenceId) setFocusedOccurrenceId(null);
    showToast(`Registro ${occurrenceId} removido do LocalStorage.`);
  };

  const handleFocusOnMap = (occurrence) => {
    setSelectedOccurrenceId(null);
    setActiveTab('map');
    setMobileView('map');
    setFocusedOccurrenceId(occurrence.id);
  };

  const handleResetDemo = () => {
    const fresh = resetDemoData();
    setOccurrences(fresh);
    setUserActions({});
    setSelectedOccurrenceId(null);
    setFocusedOccurrenceId(null);
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
    setResetCenterTrigger((c) => c + 1);
    showToast('Dados demonstrativos restaurados para o estado inicial.');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenForm={() => setIsFormOpen(true)}
        onResetDemo={handleResetDemo}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        moderationCount={moderationCount}
        totalCount={occurrences.filter((o) => o.status !== 'arquivada').length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenForm={() => setIsFormOpen(true)}
        />

        <main className="flex-1 space-y-5 p-4 sm:p-6">
          {activeTab === 'map' && (
            <>
              <IndicatorsBar occurrences={occurrences} />

              <FilterBar
                filters={filters}
                onChangeFilter={handleChangeFilter}
                onResetFilters={handleResetFilters}
                filteredCount={filteredOccurrences.length}
                totalCount={occurrences.length}
                mobileView={mobileView}
                onChangeMobileView={setMobileView}
                showMobileViewToggle
              />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div
                  className={`lg:col-span-7 xl:col-span-8 ${
                    mobileView === 'map' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <BelemMap
                    occurrences={filteredOccurrences}
                    focusedOccurrence={focusedOccurrence}
                    resetCenterTrigger={resetCenterTrigger}
                    isVisible={activeTab === 'map' && mobileView === 'map'}
                    onResetCenter={() => {
                      setFocusedOccurrenceId(null);
                      setResetCenterTrigger((n) => n + 1);
                    }}
                    onSelectOccurrence={(occ) => setSelectedOccurrenceId(occ.id)}
                  />
                </div>

                <div
                  className={`lg:col-span-5 xl:col-span-4 ${
                    mobileView === 'list' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <div className="mb-2.5 flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold text-[#0c2340]">
                      Relatos Recentes ({filteredOccurrences.length})
                    </h2>
                    <span className="text-[11px] font-medium text-slate-500">
                      Clique para localizar ou validar
                    </span>
                  </div>
                  <OccurrenceList
                    occurrences={filteredOccurrences}
                    focusedOccurrenceId={focusedOccurrenceId}
                    onFocusOnMap={handleFocusOnMap}
                    onSelectOccurrence={(occ) => setSelectedOccurrenceId(occ.id)}
                    onResetFilters={handleResetFilters}
                    onOpenForm={() => setIsFormOpen(true)}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'list' && (
            <>
              <IndicatorsBar occurrences={occurrences} />
              <FilterBar
                filters={filters}
                onChangeFilter={handleChangeFilter}
                onResetFilters={handleResetFilters}
                filteredCount={filteredOccurrences.length}
                totalCount={occurrences.length}
                mobileView={mobileView}
                onChangeMobileView={setMobileView}
                showMobileViewToggle={false}
              />
              <OccurrenceList
                occurrences={filteredOccurrences}
                focusedOccurrenceId={focusedOccurrenceId}
                onFocusOnMap={handleFocusOnMap}
                onSelectOccurrence={(occ) => setSelectedOccurrenceId(occ.id)}
                onResetFilters={handleResetFilters}
                onOpenForm={() => setIsFormOpen(true)}
                gridLayout
              />
            </>
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              occurrences={occurrences}
              searchQuery={searchQuery}
              onChangeStatus={handleChangeStatus}
              onApproveModeration={handleApproveModeration}
              onDeleteOccurrence={handleDeleteOccurrence}
              onSelectOccurrence={(occ) => setSelectedOccurrenceId(occ.id)}
              onFocusOnMap={handleFocusOnMap}
              onResetDemo={handleResetDemo}
            />
          )}

          {activeTab === 'about' && (
            <AboutPilotView
              onGoToMap={() => setActiveTab('map')}
              onOpenForm={() => setIsFormOpen(true)}
              onGoToAdmin={() => setActiveTab('admin')}
            />
          )}
        </main>
      </div>

      {/* Modal de Registro */}
      <OccurrenceFormModal
        key={isFormOpen ? 'form-open' : 'form-closed'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOccurrence}
      />

      {/* Modal de Detalhes e Confirmação Comunitária */}
      <OccurrenceDetailModal
        key={selectedOccurrence ? selectedOccurrence.id : 'detail-closed'}
        occurrence={selectedOccurrence}
        userActionState={selectedOccurrence ? userActions[selectedOccurrence.id] : null}
        onClose={() => setSelectedOccurrenceId(null)}
        onConfirmAction={handleConfirmAction}
        onFocusOnMap={handleFocusOnMap}
      />

      {/* Notificação Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-4 z-[1400] flex max-w-sm items-center gap-2.5 rounded-2xl bg-[#0c2340] px-4 py-3 text-xs font-semibold text-white shadow-xl ring-1 ring-sky-400/30"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="rounded-lg p-1 text-sky-200 hover:bg-white/10 hover:text-white"
            aria-label="Fechar notificação"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
