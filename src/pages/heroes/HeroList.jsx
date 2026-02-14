import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiLayout, FiActivity } from 'react-icons/fi';
import { pagesAPI, heroSectionsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import HeroForm from './HeroForm';

const HeroList = () => {
  const [pages, setPages] = useState([]);
  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Hero CRUD
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [deleteHeroModal, setDeleteHeroModal] = useState({ show: false, id: null });
  
  // States for Page CRUD
  const [showPageModal, setShowPageModal] = useState(false);
  const [pageName, setPageName] = useState('');
  const [editingPage, setEditingPage] = useState(null);
  const [deletePageModal, setDeletePageModal] = useState({ show: false, id: null });

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pagesRes, heroesRes] = await Promise.all([
        pagesAPI.getAll(),
        heroSectionsAPI.getAll()
      ]);
      setPages(pagesRes.data.data || []);
      setHeroSections(heroesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // --- Page Handlers ---
  const handlePageSubmit = async (e) => {
    e.preventDefault();
    if (!pageName.trim()) return;
    
    setActionLoading(true);
    try {
      if (editingPage) {
        await pagesAPI.update(editingPage._id, { name: pageName });
        toast.success('Page updated');
      } else {
        await pagesAPI.create({ name: pageName });
        toast.success('Page created');
      }
      setPageName('');
      setEditingPage(null);
      setShowPageModal(false);
      fetchInitialData();
    } catch (error) {
      console.error('Error with page action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setPageName(page.name);
    setShowPageModal(true);
  };

  const handleDeletePage = async () => {
    setActionLoading(true);
    try {
      await pagesAPI.delete(deletePageModal.id);
      toast.success('Page deleted');
      setDeletePageModal({ show: false, id: null });
      fetchInitialData();
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // --- Hero Handlers ---
  const handleEditHero = (hero) => {
    setEditingHero(hero);
    setShowHeroForm(true);
  };

  const handleDeleteHero = async () => {
    setActionLoading(true);
    try {
      await heroSectionsAPI.delete(deleteHeroModal.id);
      toast.success('Hero section deleted');
      setDeleteHeroModal({ show: false, id: null });
      fetchInitialData();
    } catch (error) {
      console.error('Error deleting hero:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHeroFormSuccess = () => {
    setShowHeroForm(false);
    setEditingHero(null);
    fetchInitialData();
  };

  return (
    <div className="space-y-12">
      {/* Pages Management Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pages</h1>
            <p className="text-gray-500 mt-1">Manage static pages for your landing platform</p>
          </div>
          <Button onClick={() => setShowPageModal(true)} className="rounded-xl shadow-soft px-6">
            <FiPlus className="w-5 h-5 mr-1" />
            Add Page
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.length === 0 ? (
                <div className="col-span-full py-8 text-center text-gray-400">No pages found</div>
              ) : (
                pages.map(page => (
                  <div key={page._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 flex justify-between items-center group">
                    <span className="font-semibold text-gray-700">{page.name}</span>
                    <div className="flex gap-1 transition-opacity">
                      <button onClick={() => handleEditPage(page)} className="p-2 text-primary-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-primary-100">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeletePageModal({ show: true, id: page._id })} className="p-2 text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>

      <hr className="border-gray-100" />

      {/* Hero Sections Management Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hero Sections</h2>
            <p className="text-gray-500 mt-1">Content and background images for page headers</p>
          </div>
          <Button onClick={() => setShowHeroForm(true)} className="rounded-xl shadow-soft px-6" disabled={pages.length === 0}>
            <FiPlus className="w-5 h-5 mr-1" />
            Add Hero Content
          </Button>
        </div>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Background</th>
                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Page</th>
                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">Content</th>
                    <th className="py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {heroSections.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-400 font-medium">
                        No hero sections configured
                      </td>
                    </tr>
                  ) : (
                    heroSections.map((hero) => (
                      <tr key={hero._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6 text-xs align-top">
                          <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-100 shadow-soft">
                            <img src={hero.backgroundImage} alt="Hero BG" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-4 px-6 align-top">
                          <span className="text-sm font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-lg">
                            {hero.page?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-6 align-top max-w-xs">
                          <p className="text-sm font-semibold text-gray-900 truncate" title={hero.heading}>{hero.heading}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{hero.description}</p>
                        </td>
                        <td className="py-4 px-6 text-right align-top">
                          <div className="flex justify-end gap-2 text-gray-400">
                            <button onClick={() => handleEditHero(hero)} className="p-2 rounded-lg hover:text-primary-500 hover:bg-primary-50 transition-colors">
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteHeroModal({ show: true, id: hero._id })} className="p-2 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* --- Modals --- */}
      
      {/* Page Modal */}
      <Modal isOpen={showPageModal} onClose={() => { setShowPageModal(false); setEditingPage(null); setPageName(''); }} title={editingPage ? 'Edit Page' : 'Add Page'}>
        <form onSubmit={handlePageSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 outline-none" 
              placeholder="e.g. Home, Services, Contact" 
              value={pageName} 
              onChange={(e) => setPageName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="secondary" onClick={() => { setShowPageModal(false); setEditingPage(null); setPageName(''); }}>Cancel</Button>
            <Button type="submit" loading={actionLoading}>{editingPage ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Page Modal */}
      <Modal isOpen={deletePageModal.show} onClose={() => setDeletePageModal({ show: false, id: null })} title="Delete Page">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this page? This might leave its hero sections without a reference.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeletePageModal({ show: false, id: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDeletePage} loading={actionLoading}>Delete</Button>
        </div>
      </Modal>

      {/* Hero Form Modal */}
      {showHeroForm && (
        <HeroForm
          hero={editingHero}
          pages={pages}
          onClose={() => { setShowHeroForm(false); setEditingHero(null); }}
          onSuccess={handleHeroFormSuccess}
        />
      )}

      {/* Delete Hero Modal */}
      <Modal isOpen={deleteHeroModal.show} onClose={() => setDeleteHeroModal({ show: false, id: null })} title="Delete Hero Section">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this hero section content?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteHeroModal({ show: false, id: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteHero} loading={actionLoading}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default HeroList;
